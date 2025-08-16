import React from "react";
import { useRecettes, useDeleteRecette } from "../queries";
import RecetteForm from "../components/RecetteForm";
import { formatCurrencyFull } from "@/utils/format";

const RecettesPage: React.FC = () => {
  const { data, isLoading, error } = useRecettes({});
  const del = useDeleteRecette();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Recettes</h1>

      <div className="max-w-md p-4 rounded-xl border">
        <h2 className="font-medium mb-2">Ajouter / éditer une recette</h2>
        <RecetteForm onSuccess={() => { /* could close modal and refetch via invalidate */ }} />
      </div>

      <div>
        <h2 className="font-medium mb-2">Liste</h2>
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-500">Erreur: {(error as any).message}</p>}
        <ul className="space-y-2">
          {data?.map((r) => (
            <li key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{r.date} — {r.carRef}</div>
                <div className="text-sm opacity-80">{formatCurrencyFull(r.montant || 0)}</div>
              </div>
              {r.id && (
                <button className="btn btn-sm" onClick={() => del.mutate(r.id!)}>
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

export default RecettesPage;
