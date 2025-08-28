'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types/stock';

interface PriceChartProps {
  data: ChartDataPoint[];
  ticker: string;
}

export default function PriceChart({ data, ticker }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gráfico de Precios - {ticker}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles para el gráfico
        </div>
      </div>
    );
  }

  // Calcular el cambio porcentual
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const percentChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  const isPositive = percentChange >= 0;

  // Formatear datos para el gráfico (tomar cada 7mo punto si hay muchos datos)
  const chartData = data.length > 50 
    ? data.filter((_, index) => index % Math.ceil(data.length / 50) === 0)
    : data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{new Date(label).toLocaleDateString('es-ES')}</p>
          <p className="text-blue-600 font-semibold">
            Precio: {formatPrice(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gráfico de Precios - {ticker}
          </h3>
          <p className="text-sm text-gray-500">
            Últimos {data.length} días de trading
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(lastPrice)}
          </div>
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Datos proporcionados por Yahoo Finance
      </div>
    </div>
  );
}