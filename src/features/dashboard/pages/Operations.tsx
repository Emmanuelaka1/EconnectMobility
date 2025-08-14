import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, Calendar, FileText, Edit, Trash2, Eye, TrendingDown, TrendingUp, Save, X, Upload, Paperclip } from 'lucide-react';
import { OperationDto, DocumentDto } from '@/Api/ApiDto';
import { operationService, documentService } from '../../Api/Service';

const VTCOperations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedParentType, setSelectedParentType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOperation, setEditingOperation] = useState<OperationDto | null>(null);
  const [selectedOperations, setSelectedOperations] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  // Données par défaut
  const [operations, setOperations] = useState<OperationDto[]>([
    {
      idoperation: 1,
      dateOperation: '2024-01-15',
      typeOperation: 'Dépense',
      typeDepense: 'Carburant',
      description: 'Plein d\'essence - Station Total',
      amount: 85.50,
      parentId: 'CAR-001',
      parentType: 'Voiture',
      documentId: 'DOC-001',
      referenceTransaction: 'REF-001',
      dcreation: '2024-01-15',
      dmodification: '2024-01-15',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      idoperation: 2,
      dateOperation: '2024-01-14',
      typeOperation: 'Recette',
      typeDepense: '',
      description: 'Course aéroport - centre ville',
      amount: 245.00,
      parentId: 'COURSE-001',
      parentType: 'Course',
      documentId: 'DOC-002',
      referenceTransaction: 'REF-002',
      dcreation: '2024-01-14',
      dmodification: '2024-01-14',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      idoperation: 3,
      dateOperation: '2024-01-13',
      typeOperation: 'Dépense',
      typeDepense: 'Maintenance',
      description: 'Révision véhicule',
      amount: 150.00,
      parentId: 'CAR-001',
      parentType: 'Voiture',
      documentId: 'DOC-003',
      referenceTransaction: 'REF-003',
      dcreation: '2024-01-13',
      dmodification: '2024-01-13',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      idoperation: 4,
      dateOperation: '2024-01-12',
      typeOperation: 'Dépense',
      typeDepense: 'Assurance',
      description: 'Prime mensuelle assurance',
      amount: 120.00,
      parentId: 'CAR-002',
      parentType: 'Voiture',
      documentId: 'DOC-004',
      referenceTransaction: 'REF-004',
      dcreation: '2024-01-12',
      dmodification: '2024-01-12',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      idoperation: 5,
      dateOperation: '2024-01-11',
      typeOperation: 'Dépense',
      typeDepense: 'Péage',
      description: 'Péages autoroute A6',
      amount: 25.80,
      parentId: 'COURSE-002',
      parentType: 'Course',
      documentId: 'DOC-005',
      referenceTransaction: 'REF-005',
      dcreation: '2024-01-11',
      dmodification: '2024-01-11',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      idoperation: 6,
      dateOperation: '2024-01-10',
      typeOperation: 'Recette',
      typeDepense: '',
      description: 'Course longue distance',
      amount: 189.50,
      parentId: 'COURSE-003',
      parentType: 'Course',
      documentId: 'DOC-006',
      referenceTransaction: 'REF-006',
      dcreation: '2024-01-10',
      dmodification: '2024-01-10',
      ucreation: 'admin',
      umodification: 'admin'
    }
  ]);

  const [formData, setFormData] = useState<OperationDto>({
    dateOperation: '',
    typeOperation: '',
    typeDepense: '',
    description: '',
    amount: 0,
    parentId: '',
    parentType: '',
    documentId: '',
    referenceTransaction: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadDocuments = async (operationId: number): Promise<DocumentDto[]> => {
    if (uploadedFiles.length === 0) return [];
    
    setUploadingDocuments(true);
    try {
      // Simulation de l'upload des documents
      // const response = await documentService.uploadMultiples(
      //   uploadedFiles, 
      //   operationId.toString(), 
      //   'Operation'
      // );
      
      // Simulation des documents créés
      const uploadedDocuments: DocumentDto[] = uploadedFiles.map((file, index) => ({
        idDocument: Date.now() + index,
        typeDocument: file.type.includes('pdf') ? 'PDF' : 'Image',
        description: `Document pour opération ${operationId}`,
        dateDocument: new Date().toISOString().split('T')[0],
        fileName: file.name,
        pathFile: `/documents/${file.name}`,
        parentId: operationId.toString(),
        parentType: 'Operation',
        urlFile: URL.createObjectURL(file),
        dcreation: new Date().toISOString().split('T')[0],
        dmodification: new Date().toISOString().split('T')[0],
        ucreation: 'admin',
        umodification: 'admin'
      }));
      
      return uploadedDocuments;
    } catch (error) {
      console.error('Erreur lors de l\'upload des documents:', error);
      return [];
    } finally {
      setUploadingDocuments(false);
    }
  };
  // Fonctions CRUD
  const handleCreate = () => {
    setEditingOperation(null);
    setFormData({
      dateOperation: '',
      typeOperation: '',
      typeDepense: '',
      description: '',
      amount: 0,
      parentId: '',
      parentType: '',
      documentId: '',
      referenceTransaction: ''
    });
    setShowModal(true);
    setUploadedFiles([]);
  };

  const handleEdit = (operation: OperationDto) => {
    setEditingOperation(operation);
    setFormData(operation);
    setShowModal(true);
    setUploadedFiles([]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      
      if (editingOperation) {
        // Modification (updateOperation)
        const updatedOperation: OperationDto = {
          ...formData,
          idoperation: editingOperation.idoperation,
          dmodification: now,
          umodification: 'admin'
        };
        
        // Simulation de l'appel API
        // await operationService.updateOperation(updatedOperation);
        
        setOperations(operations.map(op => 
          op.idoperation === editingOperation.idoperation ? updatedOperation : op
        ));
        
        // Upload des nouveaux documents si présents
        if (uploadedFiles.length > 0) {
          const newDocuments = await uploadDocuments(editingOperation.idoperation!);
          updatedOperation.documents = [...(updatedOperation.documents || []), ...newDocuments];
        }
      } else {
        // Création (saveOperation)
        const newOperation: OperationDto = {
          ...formData,
          idoperation: Math.max(...operations.map(op => op.idoperation || 0)) + 1,
          dcreation: now,
          dmodification: now,
          ucreation: 'admin',
          umodification: 'admin'
        };
        
        // Simulation de l'appel API
        // await operationService.saveOperation(newOperation);
        
        setOperations([...operations, newOperation]);
        
        // Upload des documents
        if (uploadedFiles.length > 0) {
          const newDocuments = await uploadDocuments(newOperation.idoperation!);
          newOperation.documents = newDocuments;
        }
      }
      
      setShowModal(false);
      setFormData({
        dateOperation: '',
        typeOperation: '',
        typeDepense: '',
        description: '',
        amount: 0,
        parentId: '',
        parentType: '',
        documentId: '',
        referenceTransaction: ''
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // await operationService.deleteOperation(id);
        
        setOperations(operations.filter(op => op.idoperation !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOperations.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedOperations.length} opération(s) ?`)) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // await operationService.deleteOperations(selectedOperations);
        
        setOperations(operations.filter(op => !selectedOperations.includes(op.idoperation!)));
        setSelectedOperations([]);
      } catch (error) {
        console.error('Erreur lors de la suppression en lot:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedOperations.length === 0) return;
    
    const selectedOperationsData = operations.filter(op => selectedOperations.includes(op.idoperation!));
    
    if (confirm(`Êtes-vous sûr de vouloir mettre à jour ${selectedOperations.length} opération(s) ?`)) {
      setLoading(true);
      try {
        const now = new Date().toISOString().split('T')[0];
        const updatedOperations = selectedOperationsData.map(op => ({
          ...op,
          dmodification: now,
          umodification: 'admin'
        }));
        
        // Simulation de l'appel API
        // await operationService.updateOperations(updatedOperations);
        
        setOperations(operations.map(op => {
          const updated = updatedOperations.find(uop => uop.idoperation === op.idoperation);
          return updated || op;
        }));
        
        setSelectedOperations([]);
      } catch (error) {
        console.error('Erreur lors de la mise à jour en lot:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteByParent = async (parentId: string, parentType: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer toutes les opérations liées à ${parentType} ${parentId} ?`)) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // const operationsToDelete = await operationService.getOperationsByParentType(parentId, parentType);
        // for (const op of operationsToDelete.data) {
        //   await operationService.deleteOperation(op.idoperation);
        // }
        
        setOperations(operations.filter(op => !(op.parentId === parentId && op.parentType === parentType)));
      } catch (error) {
        console.error('Erreur lors de la suppression par parent:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleOperationSelection = (id: number) => {
    setSelectedOperations(prev => 
      prev.includes(id) 
        ? prev.filter(opId => opId !== id)
        : [...prev, id]
    );
  };

  // Consultation et filtrage
  const filteredOperations = operations.filter(operation => {
    const matchesSearch = 
      operation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.referenceTransaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.parentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === '' || operation.typeOperation === selectedType;
    const matchesParentType = selectedParentType === '' || operation.parentType === selectedParentType;
    
    if (selectedPeriod === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return matchesSearch && matchesType && matchesParentType && operation.dateOperation === today;
    }
    
    return matchesSearch && matchesType && matchesParentType;
  });

  const getTypeIcon = (type: string) => {
    return type === 'Recette' ? TrendingUp : TrendingDown;
  };

  const getTypeColor = (type: string) => {
    return type === 'Recette' ? 'text-emerald-600' : 'text-red-600';
  };

  // Statistiques
  const totalRecettes = operations.filter(op => op.typeOperation === 'Recette').reduce((sum, op) => sum + (op.amount || 0), 0);
  const totalDepenses = operations.filter(op => op.typeOperation === 'Dépense').reduce((sum, op) => sum + (op.amount || 0), 0);
  const benefice = totalRecettes - totalDepenses;
  const totalOperations = operations.length;

  const parentTypes = [...new Set(operations.map(op => op.parentType).filter(Boolean))];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Opérations</h1>
          <p className="text-gray-600 mt-1">Suivi des dépenses et transactions VTC</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedOperations.length > 0 && (
            <>
              <button 
                onClick={handleBulkUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier ({selectedOperations.length})</span>
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer ({selectedOperations.length})</span>
              </button>
            </>
          )}
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Opération</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Recettes</p>
              <p className="text-2xl font-bold text-emerald-600">€{totalRecettes.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Dépenses</p>
              <p className="text-2xl font-bold text-red-600">€{totalDepenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Bénéfice Net</p>
              <p className={`text-2xl font-bold ${benefice >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                €{benefice.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Nb Opérations</p>
              <p className="text-2xl font-bold text-gray-800">{totalOperations}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="Recette">Recettes</option>
            <option value="Dépense">Dépenses</option>
          </select>
          
          <select
            value={selectedParentType}
            onChange={(e) => setSelectedParentType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les parents</option>
            {parentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Operations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Liste des Opérations ({filteredOperations.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOperations.length === filteredOperations.length && filteredOperations.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOperations(filteredOperations.map(op => op.idoperation!));
                      } else {
                        setSelectedOperations([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOperations.map((operation) => {
                const TypeIcon = getTypeIcon(operation.typeOperation || '');
                const typeColor = getTypeColor(operation.typeOperation || '');
                
                return (
                  <tr key={operation.idoperation} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOperations.includes(operation.idoperation!)}
                        onChange={() => toggleOperationSelection(operation.idoperation!)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{operation.dateOperation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className={`w-4 h-4 ${typeColor}`} />
                        <span className={`text-sm font-medium ${typeColor}`}>{operation.typeOperation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{operation.typeDepense || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${typeColor}`}>
                        €{operation.amount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">{operation.referenceTransaction}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{operation.parentType}</div>
                        <div className="text-gray-500">{operation.parentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{operation.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(operation)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(operation.idoperation!)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:opacity-50"
                        >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingOperation ? 'Modifier l\'Opération' : 'Nouvelle Opération'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de l'opération *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOperation || ''}
                    onChange={(e) => setFormData({...formData, dateOperation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'opération *
                  </label>
                  <select
                    value={formData.typeOperation || ''}
                    onChange={(e) => setFormData({...formData, typeOperation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Recette">Recette</option>
                    <option value="Dépense">Dépense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de dépense
                  </label>
                  <select
                    value={formData.typeDepense || ''}
                    onChange={(e) => setFormData({...formData, typeDepense: e.target.value})}
                    disabled={formData.typeOperation === 'Recette'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Carburant">Carburant</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Péage">Péage</option>
                    <option value="Parking">Parking</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="Ex: 85.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent ID
                  </label>
                  <input
                    type="text"
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                    placeholder="Ex: CAR-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de parent
                  </label>
                  <select
                    value={formData.parentType || ''}
                    onChange={(e) => setFormData({...formData, parentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Voiture">Voiture</option>
                    <option value="Course">Course</option>
                    <option value="Chauffeur">Chauffeur</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document ID
                  </label>
                  <input
                    type="text"
                    value={formData.documentId || ''}
                    onChange={(e) => setFormData({...formData, documentId: e.target.value})}
                    placeholder="Ex: DOC-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence transaction
                  </label>
                  <input
                    type="text"
                    value={formData.referenceTransaction || ''}
                    onChange={(e) => setFormData({...formData, referenceTransaction: e.target.value})}
                    placeholder="Ex: REF-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description de l'opération..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Section Upload de Documents */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents justificatifs
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Cliquez pour uploader des fichiers
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PDF, PNG, JPG jusqu'à 10MB
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Liste des fichiers uploadés */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploadingDocuments || !formData.dateOperation || !formData.typeOperation || !formData.amount || !formData.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                {(loading || uploadingDocuments) ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {uploadingDocuments ? 'Upload en cours...' : (editingOperation ? 'Modifier' : 'Créer')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VTCOperations;