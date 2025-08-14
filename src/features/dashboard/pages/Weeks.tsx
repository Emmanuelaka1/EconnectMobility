import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Edit, Trash2, Eye, Clock, Save, X } from 'lucide-react';

interface WeekData {
  week: string;
  dateStart: string;
  dateEnd: string;
  dcreation?: string;
  dmodification?: string;
  ucreation?: string;
  umodification?: string;
}

const VTCWeeks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState<WeekData | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  // Données par défaut
  const [weeks, setWeeks] = useState<WeekData[]>([
    {
      week: 'S01-2024',
      dateStart: '2024-01-01',
      dateEnd: '2024-01-07',
      dcreation: '2024-01-01',
      dmodification: '2024-01-01',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      week: 'S02-2024',
      dateStart: '2024-01-08',
      dateEnd: '2024-01-14',
      dcreation: '2024-01-08',
      dmodification: '2024-01-08',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      week: 'S03-2024',
      dateStart: '2024-01-15',
      dateEnd: '2024-01-21',
      dcreation: '2024-01-15',
      dmodification: '2024-01-15',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      week: 'S04-2024',
      dateStart: '2024-01-22',
      dateEnd: '2024-01-28',
      dcreation: '2024-01-22',
      dmodification: '2024-01-22',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      week: 'S05-2024',
      dateStart: '2024-01-29',
      dateEnd: '2024-02-04',
      dcreation: '2024-01-29',
      dmodification: '2024-01-29',
      ucreation: 'admin',
      umodification: 'admin'
    }
  ]);

  const [formData, setFormData] = useState<WeekData>({
    week: '',
    dateStart: '',
    dateEnd: ''
  });

  const handleCreate = () => {
    setEditingWeek(null);
    setFormData({
      week: '',
      dateStart: '',
      dateEnd: ''
    });
    setShowModal(true);
  };

  const handleEdit = (week: WeekData) => {
    setEditingWeek(week);
    setFormData(week);
    setShowModal(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    
    if (editingWeek) {
      // Mise à jour
      setWeeks(weeks.map(w => 
        w.week === editingWeek.week 
          ? { ...formData, dmodification: now, umodification: 'admin' }
          : w
      ));
    } else {
      // Création
      const newWeek: WeekData = {
        ...formData,
        dcreation: now,
        dmodification: now,
        ucreation: 'admin',
        umodification: 'admin'
      };
      setWeeks([...weeks, newWeek]);
    }
    
    setShowModal(false);
    setFormData({ week: '', dateStart: '', dateEnd: '' });
  };

  const handleDelete = (weekId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette semaine ?')) {
      setWeeks(weeks.filter(w => w.week !== weekId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedWeeks.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedWeeks.length} semaine(s) ?`)) {
      setWeeks(weeks.filter(w => !selectedWeeks.includes(w.week)));
      setSelectedWeeks([]);
    }
  };

  const toggleWeekSelection = (weekId: string) => {
    setSelectedWeeks(prev => 
      prev.includes(weekId) 
        ? prev.filter(id => id !== weekId)
        : [...prev, weekId]
    );
  };

  const filteredWeeks = weeks.filter(week => {
    const matchesSearch = week.week.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         week.dateStart.includes(searchTerm) ||
                         week.dateEnd.includes(searchTerm);
    
    if (selectedPeriod === 'current') {
      const now = new Date();
      const startDate = new Date(week.dateStart);
      const endDate = new Date(week.dateEnd);
      return matchesSearch && now >= startDate && now <= endDate;
    }
    
    return matchesSearch;
  });

  const totalWeeks = weeks.length;
  const currentWeek = weeks.find(w => {
    const now = new Date();
    const start = new Date(w.dateStart);
    const end = new Date(w.dateEnd);
    return now >= start && now <= end;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Semaines</h1>
          <p className="text-gray-600 mt-1">Configuration et suivi des semaines de travail</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedWeeks.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ({selectedWeeks.length})</span>
            </button>
          )}
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Semaine</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Semaines</p>
              <p className="text-2xl font-bold text-gray-800">{totalWeeks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Semaine Actuelle</p>
              <p className="text-2xl font-bold text-emerald-600">{currentWeek?.week || 'N/A'}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sélectionnées</p>
              <p className="text-2xl font-bold text-orange-600">{selectedWeeks.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Filtrées</p>
              <p className="text-2xl font-bold text-gray-800">{filteredWeeks.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-purple-600" />
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
              placeholder="Rechercher par semaine ou date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les périodes</option>
            <option value="current">Semaine actuelle</option>
            <option value="past">Semaines passées</option>
            <option value="future">Semaines futures</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Weeks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Liste des Semaines</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedWeeks.length === filteredWeeks.length && filteredWeeks.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWeeks(filteredWeeks.map(w => w.week));
                      } else {
                        setSelectedWeeks([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semaine
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Début
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Fin
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modifié le
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWeeks.map((week) => (
                <tr key={week.week} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedWeeks.includes(week.week)}
                      onChange={() => toggleWeekSelection(week.week)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">{week.week}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{week.dateStart}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{week.dateEnd}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{week.dcreation}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{week.dmodification}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(week)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(week.week)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingWeek ? 'Modifier la Semaine' : 'Nouvelle Semaine'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identifiant Semaine
                </label>
                <input
                  type="text"
                  value={formData.week}
                  onChange={(e) => setFormData({...formData, week: e.target.value})}
                  placeholder="Ex: S06-2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Début
                </label>
                <input
                  type="date"
                  value={formData.dateStart}
                  onChange={(e) => setFormData({...formData, dateStart: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Fin
                </label>
                <input
                  type="date"
                  value={formData.dateEnd}
                  onChange={(e) => setFormData({...formData, dateEnd: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.week || !formData.dateStart || !formData.dateEnd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingWeek ? 'Modifier' : 'Créer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VTCWeeks;