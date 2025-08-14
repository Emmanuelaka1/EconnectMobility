import React, { useState } from 'react';
import { Plus, Trash2, Edit3, DollarSign, TrendingUp, TrendingDown, Eye, Download, Edit, Save, X } from 'lucide-react';
import GenericHeader from '../Tables/GenericHeader';
import StatCard from '../Tables/StatCard';
import GenericFilters from '../Tables/GenericFilters';
import GenericTable from '../Tables/GenericTable';
import GenericModal from "../Tables/GenericModal"; // ajuste le chemin selon ton arborescence


interface Recette {
  id: number;
  date: string;
  montant: number;
  type: 'course' | 'prime' | 'autre';
  statut: 'payé' | 'en attente';
}

const Recettes: React.FC = () => {
  // --- State ---
  const [recettes, setRecettes] = useState<Recette[]>([
    { id: 1, date: '12/08/2025', montant: 150, type: 'course', statut: 'payé' },
    { id: 2, date: '11/08/2025', montant: 80, type: 'prime', statut: 'en attente' }
  ]);
  const [selectedRecettes, setSelectedRecettes] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRecette, setEditingRecette] = useState<Recette | null>(null);

  // --- Filtres et recherche ---
  const filteredRecettes = recettes.filter(rec => {
    const matchesSearch = rec.date.includes(search) || rec.montant.toString().includes(search);
    const matchesType = typeFilter === 'all' || rec.type === typeFilter;
    const matchesStatut = statutFilter === 'all' || rec.statut === statutFilter;
    return matchesSearch && matchesType && matchesStatut;
  });

  // --- Table ---
  const columns = [
    { header: 'Date', render: (r: Recette) => r.date },
    { header: 'Montant (€)', render: (r: Recette) => r.montant.toFixed(2) },
    { header: 'Type', render: (r: Recette) => r.type },
    { header: 'Statut', render: (r: Recette) => r.statut },
  ];

  // --- Sélection ---
  const toggleSelect = (id: number) => {
    setSelectedRecettes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = (checked: boolean) => {
    setSelectedRecettes(checked ? filteredRecettes.map(r => r.id) : []);
  };

   const onView = (r: Recette) => alert(`Voir #${r.id}`);
  const onEdit = (r: Recette) => {
    setEditingRecette(r);
    setShowModal(true);
  };

  const onDelete = (r: Recette) => setRecettes(prev => prev.filter(x => x.id !== r.id));
  
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <GenericHeader
        title="Recettes VTC"
        subtitle="Suivi de vos revenus"
        bulkActions={[
          {
            label: 'Supprimer',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => alert('Suppression en lot'),
            color: 'bg-red-600 text-white hover:bg-red-700',
            disabled: selectedRecettes.length === 0
          },
          {
            label: 'Modifier',
            icon: <Edit3 className="w-4 h-4" />,
            onClick: () => alert('Modification en lot'),
            color: 'bg-yellow-500 text-white hover:bg-yellow-600',
            disabled: selectedRecettes.length === 0
          }
        ]}
        mainAction={{
          label: 'Nouvelle recette',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setEditingRecette(null);
            setShowModal(true);
          },
          color: 'bg-blue-600 text-white hover:bg-blue-700'
        }}

      />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total (€)" value={recettes.reduce((sum, r) => sum + r.montant, 0)} icon={<DollarSign className="w-6 h-6 text-blue-600" />} />
        <StatCard title="Payées" value={recettes.filter(r => r.statut === 'payé').length} icon={<TrendingUp className="w-6 h-6 text-green-600" />} />
        <StatCard title="En attente" value={recettes.filter(r => r.statut === 'en attente').length} icon={<TrendingDown className="w-6 h-6 text-orange-600" />} />
        <StatCard title="Dernière MAJ" value="Aujourd'hui" icon={<Eye className="w-6 h-6 text-purple-600" />} />
      </div>

      {/* FILTRES */}
      <GenericFilters
        searchValue={search}
        onSearchChange={setSearch}
        selects={[
          {
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            options: [
              { value: 'all', label: 'Tous les types' },
              { value: 'course', label: 'Course' },
              { value: 'prime', label: 'Prime' },
              { value: 'autre', label: 'Autre' }
            ]
          },
          {
            value: statutFilter,
            onChange: (e) => setStatutFilter(e.target.value),
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'payé', label: 'Payé' },
              { value: 'en attente', label: 'En attente' }
            ]
          }
        ]}
        extraButton={
          <button
            onClick={() => alert('Exporter')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        }
      />

      {/* TABLEAU */}
      <GenericTable<Recette>
      columns={columns}
      data={recettes}
      selectedIds={selectedRecettes}
      onToggleSelectVtc={toggleSelect}
      onToggleSelectAll={toggleSelectAll}
      getRowId={(r) => r.id}
      actionsHeader="Actions"
      renderActions={(r) => (
        <>
          <button
            onClick={() => onView(r)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            aria-label="Voir"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(r)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            aria-label="Modifier"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(r)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            aria-label="Supprimer"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    />

    <GenericModal
  isOpen={showModal}
  title={editingRecette ? "Modifier la Recette" : "Nouvelle Recette"}
  onClose={() => setShowModal(false)}
  size="md"
  actions={[
    {
      label: "Annuler",
      onClick: () => setShowModal(false),
      icon: <X className="w-4 h-4" />,
    },
    {
      label: editingRecette ? "Modifier" : "Créer",
      onClick: () => {
        // Ici tu ajoutes la logique de sauvegarde
        if (editingRecette) {
          // modification
          setRecettes(prev =>
            prev.map(r => r.id === editingRecette.id ? { ...editingRecette } : r)
          );
        } else {
          // création
          setRecettes(prev => [
            ...prev,
            {
              id: prev.length + 1,
              date: "13/08/2025", // à remplacer par form value
              montant: 100,
              type: "course",
              statut: "payé",
            },
          ]);
        }
        setShowModal(false);
      },
      icon: <Save className="w-4 h-4" />,
      color: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
  ]}
>
  {/* Contenu du formulaire */}
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" className="mt-1 block w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
      <input type="number" className="mt-1 block w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Type</label>
      <select className="mt-1 block w-full border rounded-lg px-3 py-2">
        <option value="course">Course</option>
        <option value="prime">Prime</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Statut</label>
      <select className="mt-1 block w-full border rounded-lg px-3 py-2">
        <option value="payé">Payé</option>
        <option value="en attente">En attente</option>
      </select>
    </div>
  </form>
</GenericModal>

    </div>
  );
};

export default Recettes;
