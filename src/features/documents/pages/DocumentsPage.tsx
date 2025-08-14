import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import { useDocumentsByParent, downloadDocument, useDeleteDocument, useDeleteByParent } from "../queries";

const DocumentsPage: React.FC = () => {
  const [parentType, setParentType] = useState<"voiture" | "recette" | "driver">("voiture");
  const [parentId, setParentId] = useState<string>("");

  const { data, isLoading, error } = useDocumentsByParent(parentId, parentType.toUpperCase());
  const del = useDeleteDocument();
  const delByParent = useDeleteByParent();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Documents</h1>

      {/* Filtres */}
      <div className="rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Type parent</label>
            <select value={parentType} onChange={(e) => setParentType(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="voiture">Voiture</option>
              <option value="recette">Recette</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Parent ID</label>
            <input value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="ex: CAR-001 ou id numérique" />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={() => delByParent.mutate({ parentId, parentType: parentType.toUpperCase() })} disabled={!parentId}>
            Supprimer tous les docs de ce parent
          </button>
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Uploader des documents</h2>
        <UploadForm onSuccess={() => { /* invalidation via query key */ }} />
      </div>

      {/* Liste */}
      <div>
        <h2 className="font-medium mb-2">Liste</h2>
        {(!parentId) && <p className="opacity-70">Saisis un Parent ID et choisis un Type pour afficher la liste.</p>}
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-500">Erreur: {(error as any).message}</p>}
        <ul className="space-y-2">
          {data?.map((d) => (
            <li key={d.id ?? d.filename ?? Math.random()} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{d.name ?? d.filename ?? "Document"}</div>
                <div className="text-sm opacity-80">{d.parentType} • {d.parentId}</div>
              </div>
              <div className="flex items-center gap-2">
                {d.filename && <button className="px-3 py-1 rounded border" onClick={() => downloadDocument(d.filename!)}>Télécharger</button>}
                {d.id && <button className="px-3 py-1 rounded border" onClick={() => del.mutate(d.id!)}>Supprimer</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsPage;
