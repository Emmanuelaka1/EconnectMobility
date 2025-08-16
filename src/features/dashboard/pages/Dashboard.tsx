
import React, { useEffect, useRef, useState } from 'react';
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
import { formatCurrencyFull } from '@/utils/format';
import { useDashboardMonthly, useDashboardVehicles, WeeklyStat } from '../queries';
import { recetteService } from '@/core/api/webService';
import { RecetteDto, WeekDto } from '@/core/api/dataContratDto';
import { formatWeekRange, getWeekCode, getWeeksOfYear } from '@/core/utils/DateUtils';

const Dashboard: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<WeekDto | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('Août');
  const [weeks, setWeeks] = useState<WeekDto[]>([]);
  const [weeklyData, setWeeklyData] = useState<Record<string, WeeklyStat>>({});
  const vehicleListRef = useRef<HTMLDivElement>(null);
  const [canPrevVehicle, setCanPrevVehicle] = useState(false);
  const [canNextVehicle, setCanNextVehicle] = useState(false);

  useEffect(() => {
    const allWeeks = getWeeksOfYear(new Date().getFullYear());
    const currentWeekCode = getWeekCode();
    const current = allWeeks.find((w) => w.week === currentWeekCode) || null;
    setWeeks(allWeeks);
    setSelectedWeek(current);
  }, []);

  useEffect(() => {
    if (!selectedWeek || weeklyData[selectedWeek.week]) return;

    recetteService.getRecettesByWeek(selectedWeek.week).then((response) => {
      const recettes = (response.data ?? []) as RecetteDto[];
      const total = recettes.reduce((sum, r) => sum + (r?.amount ?? 0), 0);

      setWeeklyData((prev) => ({
        ...prev,
        [selectedWeek.week]: {
          label: formatWeekRange(selectedWeek.dateStart!, selectedWeek.dateEnd!),
          gain: total,
          recettes: total,
          charges: 0,
          reparations: 0,
        },
      }));
    });
  }, [selectedWeek, weeklyData]);
  //// Récupération des données des véhicules
  //et pour les chaques véhicules on récupère les données
  // Example usage: replace 'carReference' with the actual car reference you want to fetch
  // recetteService.getRecettesByCar(carReference).then((response) => {
  //   setVehiclesData(response.data ?? []);
  // });
  //A chaque fois que l'utilisateur change de mois, on met à jour les recettes par véhicule
  const { data: vehiclesData } = useDashboardVehicles();
  const { data: monthlyHistory } = useDashboardMonthly(selectedMonth);

  useEffect(() => {
    const el = vehicleListRef.current;
    if (!el) return;
    const updateButtons = () => {
      setCanPrevVehicle(el.scrollLeft > 0);
      setCanNextVehicle(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    updateButtons();
    el.addEventListener('scroll', updateButtons);
    return () => el.removeEventListener('scroll', updateButtons);
  }, [vehiclesData]);

  const scrollVehicles = (direction: 'prev' | 'next') => {
    const el = vehicleListRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth;
    const left =
      direction === 'next' ? el.scrollLeft + scrollAmount : el.scrollLeft - scrollAmount;
    el.scrollTo({ left, behavior: 'smooth' });
  };

  const currentWeekData =
    selectedWeek && weeklyData[selectedWeek.week]
      ? weeklyData[selectedWeek.week]
      : { gain: 0, recettes: 0, charges: 0, reparations: 0 };

  const currentMonthData =
    monthlyHistory ?? {
      tousVehicules: { gain: 0, recettes: 0, charges: 0, reparations: 0 },
      parVehicule: {},
    };

  const weekLabel = selectedWeek
    ? formatWeekRange(selectedWeek.dateStart!, selectedWeek.dateEnd!)
    : '';

  const months = ['Août', 'Juillet', 'Juin', 'Mai', 'Avril', 'Mars', 'Février'];

  const totalAchat = vehiclesData?.reduce((sum, v) => sum + v.achat, 0) ?? 0;
  const totalGain = vehiclesData?.reduce((sum, v) => sum + v.gain, 0) ?? 0;
  const totalReste = vehiclesData?.reduce((sum, v) => sum + v.reste, 0) ?? 0;

  const pieChartData = [
    {
      label: 'Recettes',
      value: currentMonthData.tousVehicules.recettes,
      color: '#10B981',
    },
    {
      label: 'Charges',
      value: currentMonthData.tousVehicules.charges,
      color: '#3B82F6',
    },
    {
      label: 'Réparations',
      value: currentMonthData.tousVehicules.reparations,
      color: '#F59E0B',
    },
  ];

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (!selectedWeek) return;
    const currentIndex = weeks.findIndex((w) => w.week === selectedWeek.week);
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
            <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
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
              <p className="text-3xl font-bold mb-4">{formatCurrencyFull(currentWeekData.gain)}</p>
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
                <p className="text-xl font-bold text-gray-800">{formatCurrencyFull(currentWeekData.recettes)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Charges</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrencyFull(currentWeekData.charges)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Réparations</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrencyFull(currentWeekData.reparations)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total cumulé par véhicule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Total cumulé</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollVehicles('prev')}
            disabled={!canPrevVehicle}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div
            ref={vehicleListRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4"
          >
            {vehiclesData?.map((vehicle) => (
              <div
                key={vehicle.reference}
                className="min-w-[280px] border border-orange-200 rounded-xl p-4"
              >
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
          <button
            onClick={() => scrollVehicles('next')}
            disabled={!canNextVehicle}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
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
              <p className="font-medium text-gray-800">véhicules ({vehiclesData?.length ?? 0})</p>
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
                    <span className="font-medium text-emerald-600">{formatCurrencyFull(data.gain)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Recettes: </span>
                    <span className="font-medium">{formatCurrencyFull(data.recettes)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Charges: </span>
                    <span className="font-medium text-blue-600">{formatCurrencyFull(data.charges)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Réparations: </span>
                    <span className="font-medium text-orange-600">{formatCurrencyFull(data.reparations)}</span>
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
