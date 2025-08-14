import React from 'react';
import PieChart from './PieChart';
import { Building, Users, DollarSign, MapPin, Calendar, TrendingUp } from 'lucide-react';

const Charts: React.FC = () => {
  const propertyTypeData = [
    { label: 'Villas', value: 45, color: '#3B82F6' },
    { label: 'Condos', value: 32, color: '#10B981' },
    { label: 'Apartments', value: 28, color: '#F59E0B' },
    { label: 'Penthouses', value: 15, color: '#8B5CF6' },
    { label: 'Townhouses', value: 22, color: '#EF4444' },
  ];

  const locationData = [
    { label: 'Beverly Hills', value: 34, color: '#3B82F6' },
    { label: 'Santa Monica', value: 28, color: '#10B981' },
    { label: 'Hollywood', value: 22, color: '#F59E0B' },
    { label: 'Malibu', value: 18, color: '#8B5CF6' },
    { label: 'Downtown LA', value: 25, color: '#EF4444' },
    { label: 'West Hollywood', value: 15, color: '#06B6D4' },
  ];

  const priceRangeData = [
    { label: '$500K - $1M', value: 42, color: '#10B981' },
    { label: '$1M - $2M', value: 35, color: '#3B82F6' },
    { label: '$2M - $5M', value: 28, color: '#F59E0B' },
    { label: '$5M+', value: 12, color: '#8B5CF6' },
  ];

  const salesStatusData = [
    { label: 'Available', value: 68, color: '#10B981' },
    { label: 'Pending', value: 24, color: '#F59E0B' },
    { label: 'Sold', value: 45, color: '#3B82F6' },
    { label: 'Off Market', value: 8, color: '#6B7280' },
  ];

  const clientTypeData = [
    { label: 'First-time Buyers', value: 38, color: '#3B82F6' },
    { label: 'Investors', value: 29, color: '#10B981' },
    { label: 'Upgraders', value: 25, color: '#F59E0B' },
    { label: 'Downsizers', value: 18, color: '#8B5CF6' },
  ];

  const monthlyTrendsData = [
    { label: 'Q1 2024', value: 125, color: '#3B82F6' },
    { label: 'Q2 2024', value: 148, color: '#10B981' },
    { label: 'Q3 2024', value: 132, color: '#F59E0B' },
    { label: 'Q4 2024', value: 165, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Charts</h1>
          <p className="text-gray-600 mt-1">Visualisation des données immobilières</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-800">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Clients</p>
              <p className="text-2xl font-bold text-gray-800">892</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">$4.2M</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Locations</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title="Répartition par Type de Propriété"
          data={propertyTypeData}
        />
        <PieChart
          title="Répartition par Localisation"
          data={locationData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title="Répartition par Gamme de Prix"
          data={priceRangeData}
        />
        <PieChart
          title="Statut des Ventes"
          data={salesStatusData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title="Types de Clients"
          data={clientTypeData}
        />
        <PieChart
          title="Tendances Trimestrielles"
          data={monthlyTrendsData}
        />
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights Clés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">31.7%</div>
            <div className="text-sm text-gray-600">Villas sont les plus populaires</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 mb-2">23.4%</div>
            <div className="text-sm text-gray-600">Beverly Hills domine le marché</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">36.2%</div>
            <div className="text-sm text-gray-600">Gamme $500K-$1M la plus demandée</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;