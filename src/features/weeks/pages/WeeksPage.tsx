import React from "react";
import { useWeeks, useDeleteWeek } from "../queries";
import WeekForm from "../components/WeekForm";

function formatISO(date: Date) {
  return date.toISOString().slice(0,10);
}

const WeeksPage: React.FC = () => {
  const today = new Date();
  const start = new Date(today); start.setMonth(today.getMonth() - 2);
  const [startDate, setStartDate] = React.useState(formatISO(start));
  const [endDate, setEndDate] = React.useState(formatISO(today));

  const { data, isLoading, error } = useWeeks({ startDate, endDate });
  const del = useDeleteWeek();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Semaines</h1>

      <div className="flex items-end gap-3">
        <div>
          <label className="block text-sm">Du</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Au</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
      </div>

      <div className="max-w-xl p-4 rounded-xl border">
        <h2 className="font-medium mb-2">Créer / Éditer une semaine</h2>
        <WeekForm />
      </div>

      <div>
        <h2 className="font-medium mb-2">Liste</h2>
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-500">Erreur: {(error as any).message}</p>}
        <ul className="space-y-2">
          {data?.map((w) => (
            <li key={w.id ?? w.weekNumber + "-" + w.year} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Semaine {w.weekNumber}, {w.year}</div>
                <div className="text-sm opacity-80">{w.startDate} → {w.endDate}</div>
              </div>
              {w.id && (
                <button className="px-3 py-1 rounded border" onClick={() => del.mutate(w.id!)}>
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

export default WeeksPage;
