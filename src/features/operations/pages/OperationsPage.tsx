import React from "react";
import { useOperations, useDeleteOperation } from "../queries";
import OperationForm from "../components/OperationForm";

const OperationsPage: React.FC = () => {
  const { data, isLoading, error } = useOperations({});
  const del = useDeleteOperation();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Opérations</h1>
      <div className="max-w-2xl p-4 rounded-xl border">
        <h2 className="font-medium mb-2">Ajouter / Éditer</h2>
        <OperationForm />
      </div>
      <div>
        <h2 className="font-medium mb-2">Liste</h2>
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-500">Erreur: {(error as any).message}</p>}
        <ul className="space-y-2">
          {data?.map((op) => (
            <li key={op.id ?? op.reference} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{op.date} — {op.type}</div>
                <div className="text-sm opacity-80">{op.amount?.toLocaleString()} FCFA</div>
              </div>
              {op.id && (
                <button className="px-3 py-1 rounded border" onClick={() => del.mutate(op.id!)}>
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

export default OperationsPage;
