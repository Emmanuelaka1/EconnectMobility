// ... imports identiques
import { Plus, Trash2, Edit3, Calendar, CheckSquare, Clock, Eye, Filter } from 'lucide-react';
import GenericHeader from '../Tables/GenericHeader';
import StatCard from '../Tables/StatCard';
import GenericFilters from '../Tables/GenericFilters';
import GenericTable from '../Tables/GenericTable';
import { useState } from 'react';
import { WeekDto } from '../../Api/ApiDto';

const Weeks: React.FC = () => {
  const [weeks, setWeeks] = useState<WeekDto[]>([
      {
        id: 1,
        week: 'S01-2024',
        status :'active',
        dateStart: '2024-01-01',
        dateEnd: '2024-01-07',
        dcreation: '2024-01-01',
        dmodification: '2024-01-01',
        ucreation: 'admin',
        umodification: 'admin'
      },
      {
        id: 2,
        week: 'S02-2024',
        dateStart: '2024-01-08',
        dateEnd: '2024-01-14',
        dcreation: '2024-01-08',
        dmodification: '2024-01-08',
        ucreation: 'admin',
        umodification: 'admin'
      },
      {
        id: 3,
        week: 'S03-2024',
        status :'active',
        dateStart: '2024-01-15',
        dateEnd: '2024-01-21',
        dcreation: '2024-01-15',
        dmodification: '2024-01-15',
        ucreation: 'admin',
        umodification: 'admin'
      },
      {
        id: 4,
        week: 'S04-2024',
        dateStart: '2024-01-22',
        dateEnd: '2024-01-28',
        dcreation: '2024-01-22',
        dmodification: '2024-01-22',
        ucreation: 'admin',
        umodification: 'admin'
      },
      {
        id: 5,
        week: 'S05-2024',
        dateStart: '2024-01-29',
        dateEnd: '2024-02-04',
        dcreation: '2024-01-29',
        dmodification: '2024-01-29',
        ucreation: 'admin',
        umodification: 'admin'
      }
    ]);
    
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWeeks = weeks.filter(week => {
    const matchesSearch = week.week.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || week.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    setSelectedWeeks(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = (checked: boolean) => {
    setSelectedWeeks(checked ? filteredWeeks.map(w => w.id) : []);
  };

  const columns = [
    { header: 'Nom', render: (w: WeekDto) => w.week },
    { header: 'Statut', render: (w: WeekDto) => w.status === 'active' ? '🟢 Actif' : '⚪ Archivé' },
    { header: 'Date Start', render: (w: WeekDto) => w.dateStart },
    { header: 'Date End', render: (w: WeekDto) => w.dateEnd },
    {
      header: 'Actions',
      render: (w: WeekDto) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert(`Voir semaine ${w.week}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Modifier semaine ${w.week}`)}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Supprimer ${w.week} ?`)) {
                setWeeks(prev => prev.filter(week => week.week !== w.week));
              }
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Semaines VTC"
        subtitle="Gestion et suivi de vos semaines"
        bulkActions={[
          {
            label: 'Supprimer',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => alert('Suppression en lot'),
            color: 'bg-red-600 text-white hover:bg-red-700',
            disabled: selectedWeeks.length === 0
          },
          {
            label: 'Modifier',
            icon: <Edit3 className="w-4 h-4" />,
            onClick: () => alert('Modification en lot'),
            color: 'bg-yellow-500 text-white hover:bg-yellow-600',
            disabled: selectedWeeks.length === 0
          }
        ]}
        mainAction={{
          label: 'Nouvelle semaine',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => alert('Création'),
          color: 'bg-blue-600 text-white hover:bg-blue-700'
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total" value={weeks.length} icon={<Calendar className="w-6 h-6 text-blue-600" />} />
        <StatCard title="Actives" value={weeks.filter(w => w.status === 'active').length} icon={<CheckSquare className="w-6 h-6 text-green-600" />} />
        <StatCard title="Archivé" value={weeks.filter(w => w.status === 'archived').length} icon={<Clock className="w-6 h-6 text-gray-600" />} />
        <StatCard title="Dernière MAJ" value="Hier" icon={<Eye className="w-6 h-6 text-purple-600" />} />
      </div>

      <GenericFilters
        searchValue={search}
        onSearchChange={setSearch}
        selects={[
          {
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'active', label: 'Actif' },
              { value: 'archived', label: 'Archivé' }
            ]
          }
        ]}
        extraButton={
          <button
            onClick={() => alert('Filter')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        }
      />

      <GenericTable
        columns={columns}
        data={filteredWeeks}
        selectedIds={selectedWeeks}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        getRowId={(w) => w.id}
      />
    </div>
  );
};

export default Weeks;
