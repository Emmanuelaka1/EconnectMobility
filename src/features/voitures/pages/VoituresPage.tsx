import React from "react";
import { useVoitures, useDeleteVoiture } from "../queries";
import VoitureForm from "../components/VoitureForm";

const VoituresPage: React.FC = () => {
  const { data, isLoading, error } = useVoitures();
  const del = useDeleteVoiture();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Voitures</h1>

      <div className="max-w-2xl p-4 rounded-xl border">
        <h2 className="font-medium mb-2">Ajouter / Éditer</h2>
        <VoitureForm />
      </div>

      <div>
        <h2 className="font-medium mb-2">Flotte</h2>
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-500">Erreur: {(error as any).message}</p>}
        <ul className="space-y-2">
          {data?.map((c) => (
            <li key={c.id ?? c.ref} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{c.marque} {c.modele} — {c.ref}</div>
                <div className="text-sm opacity-80">{c.plaque}</div>
              </div>
              {c.id && (
                <button className="px-3 py-1 rounded border" onClick={() => del.mutate(c.id!)}>
                  Supprimer
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoituresPage;
