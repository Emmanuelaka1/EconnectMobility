import React, { useCallback, useEffect, useState } from 'react';
import { CarDto, RecetteDto } from '@/Api/ApiDto';
import { carService, recetteService } from '@/Api/Service';
import { format } from 'date-fns';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const RecettesCarTable: React.FC = () => {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [rows, setRows] = useState<RecetteDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carService.getAllCars().then(res => {
      setCars(res.data ?? []);
    });
  }, []);

  const fetchRecettes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recetteService.getRecettesByCar(selectedCar);
      const recettes = (res.data ?? []).filter(r => r.week === selectedWeek);
      const dates = getWeekDates(selectedWeek);
      const weekRows: RecetteDto[] = dates.map(date => {
        const existing = recettes.find(r => r.dateRecette === date);
        return existing ?? {
          referencecar: selectedCar,
          dateRecette: date,
          amount: 0,
          commentRecette: '',
          week: selectedWeek,
        };
      });
      setRows(weekRows);
    } finally {
      setLoading(false);
    }
  }, [selectedCar, selectedWeek]);

  useEffect(() => {
    if (selectedCar && selectedWeek) {
      void fetchRecettes();
    } else {
      setRows([]);
    }
  }, [selectedCar, selectedWeek, fetchRecettes]);

  const getWeekDates = (week: string): string[] => {
    const match = week.match(/^S(\d+)-(\d{4})$/);
    if (!match) return [];
    const weekNum = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const dow = simple.getDay();
    const monday = new Date(simple);
    const diff = (dow === 0 ? -6 : 1) - dow;
    monday.setDate(simple.getDate() + diff);
    const dates: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(format(d, 'yyyy-MM-dd'));
    }
    return dates;
  };

  const handleRowChange = (index: number, field: keyof RecetteDto, value: string | number) => {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const toggleSelect = (id?: number) => {
    if (!id) return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const toUpdate = rows.filter(r => r.idrecette);
    const toCreate = rows.filter(r => !r.idrecette && (r.amount || r.commentRecette));
    setLoading(true);
    try {
      if (toUpdate.length) {
        await recetteService.updateRecettes(toUpdate);
      }
      if (toCreate.length) {
        await recetteService.saveRecettes(toCreate);
      }
      await fetchRecettes();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Supprimer ${selectedIds.length} recette(s) ?`)) return;
    setLoading(true);
    try {
      await recetteService.deleteRecettesByIds(selectedIds);
      await fetchRecettes();
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Recettes par véhicule</h1>
      <div className="flex space-x-4">
        <select
          value={selectedCar}
          onChange={e => setSelectedCar(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sélectionner une voiture</option>
          {cars.map(c => (
            <option key={c.referenceCar} value={c.referenceCar}>
              {c.referenceCar} - {c.immatriculation}
            </option>
          ))}
        </select>
        <input
          type="week"
          value={selectedWeek ? `${selectedWeek.slice(3)}-W${selectedWeek.slice(1,3)}` : ''}
          onChange={e => {
            const val = e.target.value;
            if (!val) {
              setSelectedWeek('');
              return;
            }
            const [year, weekNum] = val.split('-W');
            setSelectedWeek(`S${weekNum.padStart(2, '0')}-${year}`);
          }}
          className="border p-2 rounded"
        />
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded"
          onClick={fetchRecettes}
          disabled={!selectedCar || !selectedWeek || loading}
        >
          Charger
        </button>
      </div>
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border" />
                <th className="p-2 border">Jour</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Montant (€)</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.dateRecette}>
                  <td className="p-2 border text-center">
                    {row.idrecette && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.idrecette)}
                        onChange={() => toggleSelect(row.idrecette)}
                      />
                    )}
                  </td>
                  <td className="p-2 border">{days[idx]}</td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={row.dateRecette || ''}
                      onChange={e => handleRowChange(idx, 'dateRecette', e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={row.amount ?? 0}
                      onChange={e => handleRowChange(idx, 'amount', parseFloat(e.target.value))}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={row.commentRecette || ''}
                      onChange={e => handleRowChange(idx, 'commentRecette', e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Enregistrer
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Supprimer ({selectedIds.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecettesCarTable;

