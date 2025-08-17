import React, { useEffect, useState, useMemo } from 'react';
import { DollarSign, Plus, Search, Filter, Calendar, Car, Edit, Trash2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CarDto, RecetteDto } from '@/Api/ApiDto';
import { recetteService } from '@/Api/Service';
import { getMonthDates, mois } from '@/core/utils/DateUtils';
import RecettesCarTable from './RecettesCarTable';
import { formatCurrencyFull } from '@/utils/format';
import { carService } from '@/core/api/webService';

const Recettes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalCar, setModalCar] = useState('');
  const [modalWeek, setModalWeek] = useState('');
  const [selectedRecettes, setSelectedRecettes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Données par défaut - Voitures
  const [voitures, setVoitures] = useState<CarDto[]>([]);

  const [recettes, setRecettes] = useState<RecetteDto[]>([]);

  useEffect(() => {
    const { start, end } = getMonthDates(currentDate);
    setLoading(true);
    recetteService
      .getRecettesByDateBetween(start, end)
      .then(res => setRecettes(res.data ?? []))
      .finally(() => setLoading(false));

      carService.getAllCars().then(res => setVoitures(res.data ?? []));
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthLabel = `${mois[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Fonctions CRUD
  const handleCreate = () => {
    setModalCar('');
    setModalWeek('');
    setShowModal(true);
  };

  const handleEdit = (recette: RecetteDto) => {
    setModalCar(recette.car?.referenceCar || '');
    setModalWeek(recette.week || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // await recetteService.deleteRecette(id);
        
        setRecettes(recettes.filter(r => r.idrecette !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecettes.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedRecettes.length} recette(s) ?`)) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // await recetteService.deleteRecettes(selectedRecettes);
        // ou
        // await recetteService.deleteRecettesByIds(selectedRecettes);
        
        setRecettes(recettes.filter(r => !selectedRecettes.includes(r.idrecette!)));
        setSelectedRecettes([]);
      } catch (error) {
        console.error('Erreur lors de la suppression en lot:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedRecettes.length === 0) return;
    
    const selectedRecettesData = recettes.filter(r => selectedRecettes.includes(r.idrecette!));
    
    if (confirm(`Êtes-vous sûr de vouloir mettre à jour ${selectedRecettes.length} recette(s) ?`)) {
      setLoading(true);
      try {
        const now = new Date().toISOString().split('T')[0];
        const updatedRecettes = selectedRecettesData.map(r => ({
          ...r,
          dmodification: now,
          umodification: 'admin'
        }));
        
        // Simulation de l'appel API
        // await recetteService.updateRecettes(updatedRecettes);
        
        setRecettes(recettes.map(r => {
          const updated = updatedRecettes.find(ur => ur.idrecette === r.idrecette);
          return updated || r;
        }));
        
        setSelectedRecettes([]);
      } catch (error) {
        console.error('Erreur lors de la mise à jour en lot:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRecetteSelection = (id: number) => {
    setSelectedRecettes(prev => 
      prev.includes(id) 
        ? prev.filter(recetteId => recetteId !== id)
        : [...prev, id]
    );
  };

  // Consultation et filtrage
  const filteredRecettes = recettes.filter(recette => {
    const matchesSearch = 
      recette.commentRecette?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.amount?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.dateRecette?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.referencecar?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWeek = recette.week === currentWeek;
    const matchesCar = selectedCar === '' || recette.referencecar === selectedCar;

    return matchesSearch && matchesWeek && matchesCar;
  });

  const getStatusBadge = (recette: RecetteDto) => {
    // Logique pour déterminer le statut (exemple basé sur la date)
    const today = new Date();
    const recetteDate = new Date(recette.dateRecette || '');
    const daysDiff = Math.floor((today.getTime() - recetteDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let status = 'Validée';
    if (daysDiff < 1) {
      status = 'En attente';
    }
    
    const classes = {
      'Validée': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      'En attente': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Rejetée': 'bg-red-100 text-red-800 border border-red-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status}
      </span>
    );
  };

  // Statistiques
  const totalRecettes = recettes.reduce((sum, recette) => sum + (recette.amount || 0), 0);
  const recettesValidees = recettes.filter(r => {
    const today = new Date();
    const recetteDate = new Date(r.dateRecette || '');
    const daysDiff = Math.floor((today.getTime() - recetteDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 1;
  }).length;
  const recettesEnAttente = recettes.length - recettesValidees;
  const moyenneParRecette = recettes.length > 0 ? totalRecettes / recettes.length : 0;

  const weeks = useMemo(() => {
    const uniques = [...new Set(recettes.map(r => r.week).filter(Boolean))] as string[];
    return uniques.sort((a, b) => {
      const [wa, ya] = a.slice(1).split('-');
      const [wb, yb] = b.slice(1).split('-');
      if (ya === yb) return parseInt(wa) - parseInt(wb);
      return parseInt(ya) - parseInt(yb);
    });
  }, [recettes]);
  const currentWeek = weeks[currentWeekIndex] || '';

  useEffect(() => {
    if (weeks.length > 0) {
      setCurrentWeekIndex(weeks.length - 1);
    }
  }, [weeks]);

  useEffect(() => {
    setSelectedRecettes([]);
  }, [currentWeek]);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Recettes</h1>
          <p className="text-gray-600 mt-1">Suivi des gains et revenus VTC par semaine</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedRecettes.length > 0 && (
            <>
              <button 
                onClick={handleBulkUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier ({selectedRecettes.length})</span>
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer ({selectedRecettes.length})</span>
              </button>
            </>
          )}
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Recette</span>
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-200"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-medium">{monthLabel}</span>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-200"
          aria-label="Mois suivant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week Navigation */}
      {weeks.length > 0 && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
            disabled={currentWeekIndex === 0}
            className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center space-x-1"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>
          <span className="font-medium">{currentWeek}</span>
          <button
            onClick={() => setCurrentWeekIndex(i => Math.min(weeks.length - 1, i + 1))}
            disabled={currentWeekIndex === weeks.length - 1}
            className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center space-x-1"
            aria-label="Semaine suivante"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Recettes</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrencyFull(totalRecettes)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recettes Validées</p>
              <p className="text-2xl font-bold text-gray-800">{recettesValidees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En Attente</p>
              <p className="text-2xl font-bold text-gray-800">{recettesEnAttente}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Moyenne/Recette</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrencyFull(moyenneParRecette)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les voitures</option>
            {/* ordonner par marque */}
            {voitures
              .sort((a, b) => (a.referenceCar ?? '').localeCompare(b.referenceCar ?? ''))
              .map(car => (
                <option key={car.referenceCar} value={car.referenceCar}>
                  {car.referenceCar}
                </option>
              ))}
          </select>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Recettes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Liste des Recettes ({filteredRecettes.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRecettes.length === filteredRecettes.length && filteredRecettes.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecettes(filteredRecettes.map(r => r.idrecette!));
                      } else {
                        setSelectedRecettes([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voiture
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semaine
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecettes.map((recette) => (
                <tr key={recette.idrecette} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRecettes.includes(recette.idrecette!)}
                      onChange={() => toggleRecetteSelection(recette.idrecette!)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">{recette.dateRecette}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold text-gray-800">€{recette.amount?.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {recette.referencecar}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{recette.week}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-sm text-gray-600">{recette.commentRecette}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {getStatusBadge(recette)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(recette)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(recette.idrecette!)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recettes par véhicule</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <RecettesCarTable initialCar={modalCar} initialWeek={modalWeek} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recettes;
