import React from 'react';

interface ChartProps {
  title: string;
  data: { month: string; value: number }[];
}

const Chart: React.FC<ChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const isHighest = item.value === maxValue;
          
          return (
            <div key={item.month} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">
                {item.month}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHighest ? 'bg-blue-600' : 'bg-blue-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-sm font-semibold text-gray-800 text-right">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;