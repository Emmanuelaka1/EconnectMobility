import React, { useState, useEffect } from 'react';
import { Car, Plus, Search, Filter, Calendar, Edit, Trash2, Eye, Fuel, Settings, MapPin, Save, X } from 'lucide-react';
import { CarDto, DocumentDto } from '@/Api/ApiDto';
import { carService, documentService } from '../../Api/Service';
import { Upload, Paperclip } from 'lucide-react';

const VTCVoitures: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMarque, setSelectedMarque] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarDto | null>(null);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  // Données par défaut
  const [voitures, setVoitures] = useState<CarDto[]>([
    {
      referenceCar: 'CAR-001',
      immatriculation: 'ABC-123-DE',
      marque: 'BMW',
      modele: 'X5',
      couleur: 'Noir',
      carburant: 'Diesel',
      anneeAchat: '2022',
      kilometrage: '45000',
      prixAchat: 65000,
      dateAchat: '2022-06-15',
      dateMiseEnCirculation: '2022-06-01',
      dcreation: '2023-06-15',
      dmodification: '2024-01-15',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      referenceCar: 'CAR-002',
      immatriculation: 'DEF-456-GH',
      marque: 'Mercedes',
      modele: 'E-Class',
      couleur: 'Blanc',
      carburant: 'Essence',
      anneeAchat: '2021',
      kilometrage: '62000',
      prixAchat: 58000,
      dateAchat: '2021-04-10',
      dateMiseEnCirculation: '2021-04-01',
      dcreation: '2023-04-10',
      dmodification: '2024-01-10',
      ucreation: 'admin',
      umodification: 'admin'
    },
    {
      referenceCar: 'CAR-003',
      immatriculation: 'GHI-789-JK',
      marque: 'Audi',
      modele: 'A6',
      couleur: 'Gris',
      carburant: 'Hybride',
      anneeAchat: '2023',
      kilometrage: '28000',
      prixAchat: 72000,
      dateAchat: '2023-08-20',
      dateMiseEnCirculation: '2023-08-15',
      dcreation: '2023-08-20',
      dmodification: '2024-01-20',
      ucreation: 'admin',
      umodification: 'admin'
    }
  ]);

  const [formData, setFormData] = useState<CarDto>({
    referenceCar: '',
    immatriculation: '',
    marque: '',
    modele: '',
    couleur: '',
    carburant: '',
    anneeAchat: '',
    kilometrage: '',
    prixAchat: 0,
    dateAchat: '',
    dateMiseEnCirculation: ''
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

  const uploadDocuments = async (carReference: string): Promise<DocumentDto[]> => {
    if (uploadedFiles.length === 0) return [];
    
    setUploadingDocuments(true);
    try {
      // Simulation de l'upload des documents
      // const response = await documentService.uploadMultiples(
      //   uploadedFiles, 
      //   carReference, 
      //   'Voiture'
      // );
      
      // Simulation des documents créés
      const uploadedDocuments: DocumentDto[] = uploadedFiles.map((file, index) => ({
        idDocument: Date.now() + index,
        typeDocument: file.type.includes('pdf') ? 'PDF' : 'Image',
        description: `Document pour voiture ${carReference}`,
        dateDocument: new Date().toISOString().split('T')[0],
        fileName: file.name,
        pathFile: `/documents/${file.name}`,
        parentId: carReference,
        parentType: 'Voiture',
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
    setEditingCar(null);
    setFormData({
      referenceCar: '',
      immatriculation: '',
      marque: '',
      modele: '',
      couleur: '',
      carburant: '',
      anneeAchat: '',
      kilometrage: '',
      prixAchat: 0,
      dateAchat: '',
      dateMiseEnCirculation: ''
    });
    setShowModal(true);
    setUploadedFiles([]);
  };

  const handleEdit = (car: CarDto) => {
    setEditingCar(car);
    setFormData(car);
    setShowModal(true);
    setUploadedFiles([]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      
      if (editingCar) {
        // Mise à jour (updateCar)
        const updatedCar: CarDto = {
          ...formData,
          dmodification: now,
          umodification: 'admin'
        };
        
        // Simulation de l'appel API
        // await carService.updateCar(updatedCar);
        
        setVoitures(voitures.map(v => 
          v.referenceCar === editingCar.referenceCar ? updatedCar : v
        ));
        
        // Upload des nouveaux documents si présents
        if (uploadedFiles.length > 0) {
          const newDocuments = await uploadDocuments(editingCar.referenceCar!);
          updatedCar.documents = [...(updatedCar.documents || []), ...newDocuments];
        }
      } else {
        // Création (saveCar)
        const newCar: CarDto = {
          ...formData,
          referenceCar: `CAR-${String(voitures.length + 1).padStart(3, '0')}`,
          dcreation: now,
          dmodification: now,
          ucreation: 'admin',
          umodification: 'admin'
        };
        
        // Simulation de l'appel API
        // await carService.saveCar(newCar);
        
        setVoitures([...voitures, newCar]);
        
        // Upload des documents
        if (uploadedFiles.length > 0) {
          const newDocuments = await uploadDocuments(newCar.referenceCar!);
          newCar.documents = newDocuments;
        }
      }
      
      setShowModal(false);
      setFormData({
        referenceCar: '',
        immatriculation: '',
        marque: '',
        modele: '',
        couleur: '',
        carburant: '',
        anneeAchat: '',
        kilometrage: '',
        prixAchat: 0,
        dateAchat: '',
        dateMiseEnCirculation: ''
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (referenceCar: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      setLoading(true);
      try {
        // Simulation de l'appel API
        // await carService.deleteCar(referenceCar);
        
        setVoitures(voitures.filter(v => v.referenceCar !== referenceCar));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCars.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCars.length} voiture(s) ?`)) {
      setLoading(true);
      try {
        // Simulation des appels API
        // for (const referenceCar of selectedCars) {
        //   await carService.deleteCar(referenceCar);
        // }
        
        setVoitures(voitures.filter(v => !selectedCars.includes(v.referenceCar!)));
        setSelectedCars([]);
      } catch (error) {
        console.error('Erreur lors de la suppression en lot:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCarSelection = (referenceCar: string) => {
    setSelectedCars(prev => 
      prev.includes(referenceCar) 
        ? prev.filter(id => id !== referenceCar)
        : [...prev, referenceCar]
    );
  };

  // Consultation et filtrage
  const filteredVoitures = voitures.filter(voiture => {
    const matchesSearch = 
      voiture.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voiture.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voiture.immatriculation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voiture.referenceCar?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMarque = selectedMarque === '' || voiture.marque === selectedMarque;
    
    return matchesSearch && matchesMarque;
  });

  // Statistiques
  const totalVoitures = voitures.length;
  const voituresActives = voitures.length; // Toutes sont considérées actives par défaut
  const kilometrageMoyen = Math.round(
    voitures.reduce((sum, v) => sum + parseInt(v.kilometrage || '0'), 0) / totalVoitures
  );
  const prixMoyen = Math.round(
    voitures.reduce((sum, v) => sum + (v.prixAchat || 0), 0) / totalVoitures
  );

  const marques = [...new Set(voitures.map(v => v.marque).filter(Boolean))];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Voitures</h1>
          <p className="text-gray-600 mt-1">Parc automobile et maintenance</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedCars.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ({selectedCars.length})</span>
            </button>
          )}
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Voiture</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Voitures</p>
              <p className="text-2xl font-bold text-gray-800">{totalVoitures}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Voitures Actives</p>
              <p className="text-2xl font-bold text-emerald-600">{voituresActives}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Km Moyen</p>
              <p className="text-2xl font-bold text-orange-600">{kilometrageMoyen.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Fuel className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Prix Moyen</p>
              <p className="text-2xl font-bold text-purple-600">€{prixMoyen.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
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
              placeholder="Rechercher par référence, marque, modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedMarque}
            onChange={(e) => setSelectedMarque(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les marques</option>
            {marques.map(marque => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>
          
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tous les carburants</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybride">Hybride</option>
            <option value="Électrique">Électrique</option>
          </select>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Voitures Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Liste des Voitures ({filteredVoitures.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCars.length === filteredVoitures.length && filteredVoitures.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCars(filteredVoitures.map(v => v.referenceCar!));
                      } else {
                        setSelectedCars([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immatriculation
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix d'achat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'achat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVoitures.map((voiture) => (
                <tr key={voiture.referenceCar} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(voiture.referenceCar!)}
                      onChange={() => toggleCarSelection(voiture.referenceCar!)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-blue-600">{voiture.referenceCar}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{voiture.marque} {voiture.modele}</p>
                        <p className="text-xs text-gray-500">{voiture.anneeAchat} • {voiture.couleur} • {voiture.carburant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-gray-800">{voiture.immatriculation}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{parseInt(voiture.kilometrage || '0').toLocaleString()} km</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-emerald-600">€{(voiture.prixAchat || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{voiture.dateAchat}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(voiture)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(voiture.referenceCar!)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCar ? 'Modifier la Voiture' : 'Nouvelle Voiture'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immatriculation *
                  </label>
                  <input
                    type="text"
                    value={formData.immatriculation || ''}
                    onChange={(e) => setFormData({...formData, immatriculation: e.target.value})}
                    placeholder="Ex: ABC-123-DE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque *
                  </label>
                  <input
                    type="text"
                    value={formData.marque || ''}
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                    placeholder="Ex: BMW"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    value={formData.modele || ''}
                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                    placeholder="Ex: X5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <input
                    type="text"
                    value={formData.couleur || ''}
                    onChange={(e) => setFormData({...formData, couleur: e.target.value})}
                    placeholder="Ex: Noir"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carburant
                  </label>
                  <select
                    value={formData.carburant || ''}
                    onChange={(e) => setFormData({...formData, carburant: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année d'achat
                  </label>
                  <input
                    type="text"
                    value={formData.anneeAchat || ''}
                    onChange={(e) => setFormData({...formData, anneeAchat: e.target.value})}
                    placeholder="Ex: 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilométrage
                  </label>
                  <input
                    type="text"
                    value={formData.kilometrage || ''}
                    onChange={(e) => setFormData({...formData, kilometrage: e.target.value})}
                    placeholder="Ex: 45000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix d'achat (€)
                  </label>
                  <input
                    type="number"
                    value={formData.prixAchat || ''}
                    onChange={(e) => setFormData({...formData, prixAchat: parseFloat(e.target.value) || 0})}
                    placeholder="Ex: 65000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'achat
                  </label>
                  <input
                    type="date"
                    value={formData.dateAchat || ''}
                    onChange={(e) => setFormData({...formData, dateAchat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de mise en circulation
                  </label>
                  <input
                    type="date"
                    value={formData.dateMiseEnCirculation || ''}
                    onChange={(e) => setFormData({...formData, dateMiseEnCirculation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Section Upload de Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents de la voiture
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
                          Carte grise, assurance, contrôle technique... (PDF, PNG, JPG jusqu'à 10MB)
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
                disabled={loading || uploadingDocuments}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploadingDocuments || !formData.immatriculation || !formData.marque || !formData.modele}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                {(loading || uploadingDocuments) ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {uploadingDocuments ? 'Upload en cours...' : (editingCar ? 'Modifier' : 'Créer')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VTCVoitures;