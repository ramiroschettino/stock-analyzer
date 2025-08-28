'use client';

import { StockData } from '@/types/stock';
import { Building2, Users, Globe, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import PriceChart from './PriceChart';

interface StockInfoProps {
  data: StockData;
}

export default function StockInfo({ data }: StockInfoProps) {
  const metricsData = [
    {
      label: 'Capitalización de Mercado',
      value: data.metrics.marketCapFormatted,
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      description: 'Valor total de la empresa en el mercado'
    },
    {
      label: 'Ingresos Anuales',
      value: data.metrics.revenueFormatted,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      description: 'Ingresos totales del último año fiscal'
    },
    {
      label: 'Ganancias Netas',
      value: data.metrics.netIncomeFormatted,
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      description: 'Beneficio neto después de impuestos'
    },
    {
      label: 'Ratio P/E',
      value: data.metrics.peRatioFormatted,
      icon: <BarChart3 className="h-5 w-5 text-purple-600" />,
      description: 'Precio por acción / Ganancias por acción'
    },
    {
      label: 'Dividendo (%)',
      value: data.metrics.dividendYieldFormatted,
      icon: <DollarSign className="h-5 w-5 text-orange-600" />,
      description: 'Rendimiento anual de dividendos'
    },
    {
      label: 'Empleados',
      value: data.metrics.employeesFormatted,
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      description: 'Número total de empleados'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Card Principal de la Empresa */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{data.companyName}</h1>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  {data.ticker}
                </span>
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {data.country}
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-blue-100">
                  <span className="font-medium">Sector:</span> {data.sector}
                </p>
                <p className="text-blue-100">
                  <span className="font-medium">Industria:</span> {data.industry}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{data.metrics.currentPriceFormatted}</div>
              <div className="text-blue-200 text-sm">{data.currency}</div>
            </div>
          </div>
        </div>

        {/* Descripción de la empresa */}
        {data.summary && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Acerca de la empresa</h3>
            <p className="text-gray-700 leading-relaxed">
              {data.summary.length > 300 
                ? `${data.summary.substring(0, 300)}...` 
                : data.summary
              }
            </p>
            {data.website && (
              <div className="mt-3">
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Visitar sitio web
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid de Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsData.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {metric.icon}
                  <h3 className="text-sm font-medium text-gray-600 ml-2">
                    {metric.label}
                  </h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500">
                  {metric.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Precios */}
      <PriceChart data={data.chartData} ticker={data.ticker} />

      {/* Footer con información de actualización */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Última actualización:</span>{' '}
          {new Date(data.lastUpdated).toLocaleString('es-ES')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Datos proporcionados por {data.dataSource}
        </p>
      </div>
    </div>
  );
}