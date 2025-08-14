import React from 'react';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  title: string;
  data: PieChartData[];
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ title, data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg width={size} height={size} viewBox="0 0 200 200" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const path = createPath(percentage, cumulativePercentage);
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
            {/* Center circle for donut effect */}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        <div className="ml-8 space-y-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.value} ({percentage}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;