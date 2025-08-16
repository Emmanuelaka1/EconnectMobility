import React, { useState, useEffect } from 'react';
import { 
  Car, 
  DollarSign, 
  Users, 
  Wrench, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Coins,
  Receipt,
} from 'lucide-react';
import PieChart from '@/components/PieChart';
import { formatCurrency, formatCurrencyFull } from '@/utils/format';

// Données par défaut simulées pour le tableau de bord
const weeklyDataDefault = {
  'Du lun. 11 août - dim. 17 août 2025': {
    gain: 400000,
    recettes: 400000,
    charges: 0,
    reparations: 0
  },
  'Du lun. 4 août - dim. 10 août 2025': {
    gain: 350000,
    recettes: 380000,
    charges: 30000,
    reparations: 0
  },
  'Du lun. 28 juil - dim. 3 août 2025': {
    gain: 320000,
    recettes: 350000,
    charges: 25000,
    reparations: 5000
  }
};

const vehiclesDataDefault = [
  {
    reference: 'EM20517-01',
    achat: 8000000,
    gain: 2428500,
    reste: 5571500
  },
  {
    reference: 'EM28431-01',
    achat: 8000000,
    gain: 1035000,
    reste: 6965000
  },
  {
    reference: 'EM13548-01',
    achat: 6500000,
    gain: 1850000,
    reste: 4650000
  }
];

const monthlyHistoryDefault = {
  'Août': {
    tousVehicules: {
      gain: 1475000,
      recettes: 1475000,
      charges: 0,
      reparations: 0
    },
    parVehicule: {
      'EM20517-01': { gain: 242500, recettes: 242500, charges: 0, reparations: 0 },
      'EM28431-01': { gain: 185000, recettes: 185000, charges: 0, reparations: 0 },
      'EM13548-01': { gain: 463800, recettes: 537500, charges: 26000, reparations: 47700 }
    }
  },
  'Juillet': {
    tousVehicules: {
      gain: 3035500,
      recettes: 3530000,
      charges: 404500,
      reparations: 90000
    },
    parVehicule: {
      'EM20517-01': { gain: 580000, recettes: 620000, charges: 35000, reparations: 5000 },
      'EM28431-01': { gain: 420000, recettes: 450000, charges: 25000, reparations: 5000 },
      'EM13548-01': { gain: 2035500, recettes: 2460000, charges: 344500, reparations: 80000 }
    }
  },
  'Juin': {
    tousVehicules: {
      gain: 2850000,
      recettes: 3200000,
      charges: 280000,
      reparations: 70000
    },
    parVehicule: {
      'EM20517-01': { gain: 520000, recettes: 550000, charges: 25000, reparations: 5000 },
      'EM28431-01': { gain: 380000, recettes: 400000, charges: 15000, reparations: 5000 },
      'EM13548-01': { gain: 1950000, recettes: 2250000, charges: 240000, reparations: 60000 }
    }
  }
};

type DashboardData = {
  weeklyData: typeof weeklyDataDefault;
  vehiclesData: typeof vehiclesDataDefault;
  monthlyHistory: typeof monthlyHistoryDefault;
};

function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function load() {
      try {
        // Remplacer par un appel API réel si nécessaire
        setData({
          weeklyData: weeklyDataDefault,
          vehiclesData: vehiclesDataDefault,
          monthlyHistory: monthlyHistoryDefault,
        });
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return { data, isLoading, error };
}

// Données par défaut simulées pour le tableau de bord
const weeklyDataDefault = {
  'Du lun. 11 août - dim. 17 août 2025': {
    gain: 400000,
    recettes: 400000,
    charges: 0,
    reparations: 0
  },
  'Du lun. 4 août - dim. 10 août 2025': {
    gain: 350000,
    recettes: 380000,
    charges: 30000,
    reparations: 0
  },
  'Du lun. 28 juil - dim. 3 août 2025': {
    gain: 320000,
    recettes: 350000,
    charges: 25000,
    reparations: 5000
  }
};

const vehiclesDataDefault = [
  {
    reference: 'EM20517-01',
    achat: 8000000,
    gain: 2428500,
    reste: 5571500
  },
  {
    reference: 'EM28431-01',
    achat: 8000000,
    gain: 1035000,
    reste: 6965000
  },
  {
    reference: 'EM13548-01',
    achat: 6500000,
    gain: 1850000,
    reste: 4650000
  }
];

const monthlyHistoryDefault = {
  'Août': {
    tousVehicules: {
      gain: 1475000,
      recettes: 1475000,
      charges: 0,
      reparations: 0
    },
    parVehicule: {
      'EM20517-01': { gain: 242500, recettes: 242500, charges: 0, reparations: 0 },
      'EM28431-01': { gain: 185000, recettes: 185000, charges: 0, reparations: 0 },
      'EM13548-01': { gain: 463800, recettes: 537500, charges: 26000, reparations: 47700 }
    }
  },
  'Juillet': {
    tousVehicules: {
      gain: 3035500,
      recettes: 3530000,
      charges: 404500,
      reparations: 90000
    },
    parVehicule: {
      'EM20517-01': { gain: 580000, recettes: 620000, charges: 35000, reparations: 5000 },
      'EM28431-01': { gain: 420000, recettes: 450000, charges: 25000, reparations: 5000 },
      'EM13548-01': { gain: 2035500, recettes: 2460000, charges: 344500, reparations: 80000 }
    }
  },
  'Juin': {
    tousVehicules: {
      gain: 2850000,
      recettes: 3200000,
      charges: 280000,
      reparations: 70000
    },
    parVehicule: {
      'EM20517-01': { gain: 520000, recettes: 550000, charges: 25000, reparations: 5000 },
      'EM28431-01': { gain: 380000, recettes: 400000, charges: 15000, reparations: 5000 },
      'EM13548-01': { gain: 1950000, recettes: 2250000, charges: 240000, reparations: 60000 }
    }
  }
};

type DashboardData = {
  weeklyData: typeof weeklyDataDefault;
  vehiclesData: typeof vehiclesDataDefault;
  monthlyHistory: typeof monthlyHistoryDefault;
};

function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function load() {
      try {
        // Remplacer par un appel API réel si nécessaire
        setData({
          weeklyData: weeklyDataDefault,
          vehiclesData: vehiclesDataDefault,
          monthlyHistory: monthlyHistoryDefault,
        });
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return { data, isLoading, error };
}

const Dashboard: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('Du lun. 11 août - dim. 17 août 2025');
  const [selectedMonth, setSelectedMonth] = useState('Août');

  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div className="p-6">Chargement…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-500">
        Erreur: {(error as any)?.message || 'Une erreur est survenue'}
      </div>
    );
  }

  const weeklyData = data.weeklyData;
  const vehiclesData = data.vehiclesData;
  const monthlyHistory = data.monthlyHistory;

  const months = ['Août', 'Juillet', 'Juin', 'Mai', 'Avril', 'Mars', 'Février'];
  const weeks = Object.keys(weeklyData);

  const currentWeekData = weeklyData[selectedWeek as keyof typeof weeklyData];
  const currentMonthData = monthlyHistory[selectedMonth as keyof typeof monthlyHistory];

  // Calcul des totaux
  const totalAchat = vehiclesData.reduce((sum, v) => sum + v.achat, 0);
  const totalGain = vehiclesData.reduce((sum, v) => sum + v.gain, 0);
  const totalReste = vehiclesData.reduce((sum, v) => sum + v.reste, 0);

  // Données pour le graphique en secteurs
  const pieChartData = [
    {
      label: 'Recettes',
      value: currentMonthData.tousVehicules.recettes,
      color: '#10B981'
    },
    {
      label: 'Charges',
      value: currentMonthData.tousVehicules.charges,
      color: '#3B82F6'
    },
    {
      label: 'Réparations',
      value: currentMonthData.tousVehicules.reparations,
      color: '#F59E0B'
    }
  ];

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentIndex = weeks.indexOf(selectedWeek);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedWeek(weeks[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < weeks.length - 1) {
      setSelectedWeek(weeks[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header avec navigation semaine */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="bg-gray-200 rounded-full px-6 py-2">
            <span className="text-sm font-medium text-gray-700">{selectedWeek}</span>
          </div>
          
          <button 
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Résumé hebdomadaire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gain principal */}
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-16">
              <h3 className="text-lg font-medium mb-2">Gain</h3>
              <p className="text-3xl font-bold mb-4">{formatCurrency(currentWeekData.gain)}</p>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                <span>Détails</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recettes</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(currentWeekData.recettes)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Charges</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(currentWeekData.charges)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Réparations</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(currentWeekData.reparations)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gérer ma flotte */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Gérer ma flotte</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-3 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Mes</p>
              <p className="font-medium text-gray-800">Chauffeurs (1)</p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-3 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Mes</p>
              <p className="font-medium text-gray-800">véhicules ({vehiclesData.length})</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Mes recettes</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-xl p-4 flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Mes charges</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl p-4 flex items-center space-x-3 cursor-pointer lg:col-start-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Mes réparations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total cumulé par véhicule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Total cumulé</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {vehiclesData.map((vehicle, index) => (
            <div key={vehicle.reference} className="border border-orange-200 rounded-xl p-4">
              <h3 className="text-lg font-bold text-orange-600 mb-4">{vehicle.reference}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Achat</span>
                  <span className="font-bold text-gray-800">{formatCurrencyFull(vehicle.achat)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gain</span>
                  <span className="font-bold text-emerald-600">{formatCurrencyFull(vehicle.gain)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reste</span>
                  <span className="font-bold text-red-600">{formatCurrencyFull(vehicle.reste)}</span>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(vehicle.gain / vehicle.achat) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((vehicle.gain / vehicle.achat) * 100).toFixed(1)}% remboursé
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé total */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3">Résumé Total Flotte</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Achat</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrencyFull(totalAchat)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Gain</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrencyFull(totalGain)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Reste</p>
              <p className="text-lg font-bold text-red-600">{formatCurrencyFull(totalReste)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historique mensuel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Historique mensuel</h2>
        
        {/* Sélecteur de mois */}
        <div className="flex flex-wrap gap-2 mb-6">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMonth === month
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résumé tous véhicules */}
          <div className="border border-orange-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-orange-600 mb-4">Tous les véhicules</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gain</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrencyFull(currentMonthData.tousVehicules.gain)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recettes</span>
                <span className="font-bold text-gray-800">
                  {formatCurrencyFull(currentMonthData.tousVehicules.recettes)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Charges</span>
                <span className="font-bold text-blue-600">
                  {formatCurrencyFull(currentMonthData.tousVehicules.charges)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Réparations</span>
                <span className="font-bold text-orange-600">
                  {formatCurrencyFull(currentMonthData.tousVehicules.reparations)}
                </span>
              </div>
            </div>
          </div>

          {/* Détail par véhicule */}
          <div className="space-y-4">
            {Object.entries(currentMonthData.parVehicule).map(([vehicleRef, data]) => (
              <div key={vehicleRef} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-bold text-orange-600 mb-2">{vehicleRef}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Gain: </span>
                    <span className="font-medium text-emerald-600">{formatCurrency(data.gain)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Recettes: </span>
                    <span className="font-medium">{formatCurrency(data.recettes)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Charges: </span>
                    <span className="font-medium text-blue-600">{formatCurrency(data.charges)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Réparations: </span>
                    <span className="font-medium text-orange-600">{formatCurrency(data.reparations)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique en secteurs */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Recettes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Charges</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">Réparations</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <PieChart
                title=""
                data={pieChartData}
                size={300}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {getPercentage(
                      currentMonthData.tousVehicules.recettes,
                      currentMonthData.tousVehicules.recettes + 
                      currentMonthData.tousVehicules.charges + 
                      currentMonthData.tousVehicules.reparations
                    )}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
