import React, { useCallback, useEffect, useState } from 'react';
import { CarDto, RecetteDto } from '@/Api/ApiDto';
import { carService, recetteService } from '@/Api/Service';
import { format } from 'date-fns';
import { toISOWeek } from '@/core/utils/DateUtils';
import { formatCurrencyFull } from '@/utils/format';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface RecettesCarTableProps {
  initialCar?: string;
  initialWeek?: string;
}

const RecettesCarTable: React.FC<RecettesCarTableProps> = ({ initialCar = '', initialWeek = '' }) => {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [selectedCar, setSelectedCar] = useState(initialCar);
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const [rows, setRows] = useState<RecetteDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const maxWeek = toISOWeek(today);

  useEffect(() => {
    carService.getAllCars().then(res => {
      setCars(res.data ?? []);
    });
  }, []);

  const fetchRecettes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recetteService.getRecettesByCarAndWeek(selectedCar, selectedWeek);
      const recettes = (res.data ?? []).filter(r => r.week === selectedWeek);
      const dates = getWeekDates(selectedWeek);
      console.log('Recettes for week:', selectedWeek, 'Dates:', dates, 'Found:', recettes.length);
      const weekRows: RecetteDto[] = dates.map(date => {
        const existing = recettes.find(r => r.dateRecette === date);
        return existing ?? {
          referencecar: selectedCar,
          dateRecette: date,
          amount: 22500,
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
    setSelectedCar(initialCar);
  }, [initialCar]);

  useEffect(() => {
    setSelectedWeek(initialWeek);
  }, [initialWeek]);

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
    const toCreate = rows.filter(r => !r.idrecette && r.amount);
    setLoading(true);
    try {
      if (toUpdate.length) await recetteService.updateRecettes(toUpdate);
      if (toCreate.length) await recetteService.saveRecettes(toCreate);
      
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
      <div className="flex space-x-4">
        <select
          value={selectedCar}
          onChange={e => setSelectedCar(e.target.value)}
          className="border p-2 rounded text-gray-900"
        >
          <option value="">Sélectionner une voiture</option>
          {cars.sort((a, b) => (a.referenceCar ?? '').localeCompare(b.referenceCar ?? '')).map(c => (
            <option key={c.referenceCar} value={c.referenceCar}>
              {c.referenceCar}
            </option>
          ))}
        </select>
        <input
          type="week"
          value={selectedWeek ? `${selectedWeek.slice(4)}-W${selectedWeek.slice(1,3)}` : ''}
           max={maxWeek}
          onChange={e => {
            const val = e.target.value;
            if (!val) {
              setSelectedWeek('');
              return;
            }
            const [year, weekNum] = val.split('-W');
            setSelectedWeek(`S${weekNum.padStart(2, '0')}-${year}`);
          }}
          className="border p-2 rounded text-gray-900"
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
                <th className="p-2 border text-gray-900" />
                <th className="p-2 border text-gray-900">Jour</th>
                <th className="p-2 border text-gray-900">Date</th>
                <th className="border text-gray-900">Montant (F CFA)</th>
                <th className="p-2 border text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.dateRecette}>
                  <td className="p-2 border text-center text-gray-900">
                    {row.idrecette && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.idrecette)}
                        onChange={() => toggleSelect(row.idrecette)}
                        className="text-gray-900"
                      />
                    )}
                  </td>
                  <td className="p-2 border text-gray-900">{days[idx]}</td>
                  <td className="p-2 border text-gray-900">
                    <input
                      type="date"
                      value={row.dateRecette || ''}
                      onChange={e => handleRowChange(idx, 'dateRecette', e.target.value)}
                      className="border p-1 rounded w-full text-gray-900"
                      disabled/>
                  </td>
                  <td className="p-2 border text-gray-900">
                    <input
                      type="number"
                      value={row.amount ?? 0}
                      onChange={e => handleRowChange(idx, 'amount', parseFloat(e.target.value))}
                      className="border p-1 rounded w-full text-gray-900"
                    />
                  </td>
                  <td className="p-2 border text-gray-900">
                    <input
                      type="text"
                      value={row.commentRecette || ''}
                      onChange={e => handleRowChange(idx, 'commentRecette', e.target.value)}
                      className="border p-1 rounded w-full text-gray-900"
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

