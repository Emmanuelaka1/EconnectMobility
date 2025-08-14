import React from 'react';
import { Building, DollarSign, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import StatsCard from './StatsCard';
import Chart from './Chart';
import PropertyTable from './PropertyTable';

const Analytics: React.FC = () => {
  const salesData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 74 },
  ];

  const revenueData = [
    { month: 'Jan', value: 2400000 },
    { month: 'Feb', value: 2800000 },
    { month: 'Mar', value: 2200000 },
    { month: 'Apr', value: 3400000 },
    { month: 'May', value: 3800000 },
    { month: 'Jun', value: 4200000 },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value="1,247"
          change="+12.5%"
          changeType="increase"
          icon={Building}
          color="blue"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$4.2M"
          change="+18.2%"
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Active Clients"
          value="892"
          change="+8.1%"
          changeType="increase"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Properties Sold"
          value="234"
          change="-2.4%"
          changeType="decrease"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Monthly Sales" data={salesData} />
        <Chart title="Revenue Trends" data={revenueData} />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PropertyTable />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <Building className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Add New Property</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Add New Client</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Schedule Viewing</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Market Analysis</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Locations</h3>
            <div className="space-y-3">
              {[
                { name: 'Beverly Hills', count: 34, percentage: 85 },
                { name: 'Santa Monica', count: 28, percentage: 70 },
                { name: 'Hollywood', count: 22, percentage: 55 },
                { name: 'Malibu', count: 18, percentage: 45 },
              ].map((location, index) => (
                <div key={location.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{location.name}</span>
                    <span className="text-xs text-gray-500">{location.count} properties</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;