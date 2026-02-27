import React from 'react';

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  type?: 'bar' | 'pie' | 'line';
  title?: string;
  className?: string;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({
  data,
  type = 'bar',
  title,
  className = '',
  height = 300
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="w-full bg-white/10 rounded-t-lg relative overflow-hidden">
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${
                item.color || 'bg-gradient-to-t from-blue-500 to-blue-400'
              }`}
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? '4px' : '0px'
              }}
            />
          </div>
          <div className="mt-2 text-xs text-white/70 text-center">
            <div className="font-medium">{item.label}</div>
            <div className="text-white/50">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const radius = Math.min(height / 2 - 40, 80);
    const centerX = height / 2;
    const centerY = height / 2;
    
    let currentAngle = 0;
    const slices = data.map((item, index) => {
      const angle = (item.value / totalValue) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      return {
        pathData,
        color: item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`,
        label: item.label,
        value: item.value,
        percentage: ((item.value / totalValue) * 100).toFixed(1)
      };
    });
    
    return (
      <div className="flex items-center justify-center">
        <svg width={height} height={height} className="transform -rotate-90">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.pathData}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </svg>
        <div className="ml-6 space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-white/80">
                {slice.label}: {slice.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="relative h-full">
      <svg width="100%" height={height} className="absolute inset-0">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height={height} fill="url(#grid)" />
        
        {/* Line chart */}
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80;
            return `${x},${y}`;
          }).join(' ')}
          className="animate-pulse"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="#3B82F6"
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            />
          );
        })}
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/60 px-4">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </div>
    </div>
  );
};

export default Chart;