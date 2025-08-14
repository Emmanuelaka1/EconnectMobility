import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Filter, Calendar, Download, Edit, Trash2, Eye, FileText, Image, File } from 'lucide-react';
import TableHeader from '@/components/Tables/TableHeader';


const VTCDocuments: React.FC = () => {
  const headers = [
    "Document",
    "Type",
    "Taille",
    "Date Upload",
    "Catégorie",
    "Statut",
    "Actions",
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedParent, setSelectedParent] = useState('');

  const documents = [
    {
      id: '1',
      nom: 'Carte Grise BMW X5',
      type: 'PDF',
      taille: '2.4 MB',
      dateUpload: '2024-01-15',
      parentId: 'CAR-001',
      parentType: 'Voiture',
      description: 'Carte grise du véhicule BMW X5 - ABC123',
      statut: 'Valide'
    },
    {
      id: '2',
      nom: 'Assurance Mercedes E-Class',
      type: 'PDF',
      taille: '1.8 MB',
      dateUpload: '2024-01-14',
      parentId: 'CAR-002',
      parentType: 'Voiture',
      description: 'Certificat d\'assurance Mercedes E-Class',
      statut: 'Expire bientôt'
    },
    {
      id: '3',
      nom: 'Facture Révision',
      type: 'PDF',
      taille: '856 KB',
      dateUpload: '2024-01-13',
      parentId: 'OP-003',
      parentType: 'Opération',
      description: 'Facture de révision véhicule',
      statut: 'Valide'
    },
    {
      id: '4',
      nom: 'Photo Véhicule Avant',
      type: 'JPG',
      taille: '3.2 MB',
      dateUpload: '2024-01-12',
      parentId: 'CAR-001',
      parentType: 'Voiture',
      description: 'Photo avant du véhicule BMW X5',
      statut: 'Valide'
    },
    {
      id: '5',
      nom: 'Contrat Chauffeur',
      type: 'PDF',
      taille: '1.2 MB',
      dateUpload: '2024-01-10',
      parentId: 'USER-001',
      parentType: 'Utilisateur',
      description: 'Contrat de travail chauffeur VTC',
      statut: 'Valide'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return Image;
      default:
        return File;
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      'Valide': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      'Expire bientôt': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Expiré': 'bg-red-100 text-red-800 border border-red-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status}
      </span>
    );
  };

  const totalDocuments = documents.length;
  const documentsValides = documents.filter(d => d.statut === 'Valide').length;
  const documentsExpires = documents.filter(d => d.statut === 'Expire bientôt').length;
  const tailleTotal = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.taille.split(' ')[0]);
    const unit = doc.taille.split(' ')[1];
    return sum + (unit === 'MB' ? size : size / 1000);
  }, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Documents</h1>
          <p className="text-gray-600 mt-1">Stockage et organisation des fichiers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-800">{totalDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Documents Valides</p>
              <p className="text-2xl font-bold text-emerald-600">{documentsValides}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">À Renouveler</p>
              <p className="text-2xl font-bold text-orange-600">{documentsExpires}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Espace Utilisé</p>
              <p className="text-2xl font-bold text-gray-800">{tailleTotal.toFixed(1)} MB</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les types</option>
          <option value="PDF">PDF</option>
          <option value="JPG">Images</option>
          <option value="DOC">Documents</option>
        </select>
          
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            <option value="Voiture">Voitures</option>
            <option value="Opération">Opérations</option>
            <option value="Utilisateur">Utilisateurs</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Liste des Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader headers={headers} />
            
            <tbody className="divide-y divide-gray-200">
              {documents.map((document) => {
                const FileIcon = getFileIcon(document.type);
                
                return (
                  <tr key={document.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{document.nom}</p>
                          <p className="text-xs text-gray-500">{document.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-600">{document.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{document.taille}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{document.dateUpload}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{document.parentType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(document.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-150">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VTCDocuments;