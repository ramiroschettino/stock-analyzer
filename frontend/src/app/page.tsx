'use client';

import { useState } from 'react';
import { StockData } from '@/types/stock';
import StockForm from '@/components/StockForm';
import StockInfo from '@/components/StockInfo';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.onrender.com';

export default function Home() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const searchStock = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setStockData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/company-info?ticker=${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Agregar timeout para evitar esperas infinitas
        signal: AbortSignal.timeout(30000), // 30 segundos
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontró información para el ticker "${ticker}". Verifica que sea correcto.`);
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intenta nuevamente en unos minutos.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const data: StockData = await response.json();
      setStockData(data);
      setIsOnline(true);
      
    } catch (error: any) {
      console.error('Error fetching stock data:', error);
      
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        setError('La consulta tardó demasiado. Verifica tu conexión e intenta nuevamente.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        setIsOnline(false);
      } else {
        setError(error.message || 'Error desconocido al obtener los datos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    setError(null);
    setIsOnline(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con indicador de conexión */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Estado de conexión:</span>
              {isOnline ? (
                <span className="flex items-center text-green-600 text-sm">
                  <Wifi className="h-4 w-4 mr-1" />
                  Conectado
                </span>
              ) : (
                <button 
                  onClick={retryConnection}
                  className="flex items-center text-red-600 text-sm hover:text-red-800"
                >
                  <WifiOff className="h-4 w-4 mr-1" />
                  Sin conexión - Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario de búsqueda */}
        <div className="mb-8">
          <StockForm onSearch={searchStock} isLoading={isLoading} />
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Error al obtener los datos
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  {!isOnline && (
                    <button
                      onClick={retryConnection}
                      className="mt-3 text-sm text-red-800 underline hover:text-red-900"
                    >
                      Reintentar conexión
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Obteniendo información financiera...
            </div>
          </div>
        )}

        {/* Información de la empresa */}
        {stockData && !isLoading && (
          <div className="animate-fade-in">
            <StockInfo data={stockData} />
          </div>
        )}

        {/* Mensaje de bienvenida si no hay datos */}
        {!stockData && !isLoading && !error && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Bienvenido a Stock Analyzer
              </h2>
              <p className="text-gray-600 mb-6">
                Ingresa el ticker de cualquier empresa para obtener información financiera detallada, 
                métricas clave y gráficos de precios históricos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex flex-col items-center p-4">
                  <div className="bg-blue-100 rounded-full p-3 mb-3">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-medium">Métricas Financieras</span>
                  <span className="text-center">P/E, Market Cap, Revenue</span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-green-100 rounded-full p-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium">Gráficos Interactivos</span>
                  <span className="text-center">Precios históricos del último año</span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-purple-100 rounded-full p-3 mb-3">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium">Info Empresarial</span>
                  <span className="text-center">Sector, industria, empleados</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Stock Analyzer. Datos proporcionados por Yahoo Finance.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Esta aplicación es solo para fines educativos y no constituye asesoramiento financiero.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}