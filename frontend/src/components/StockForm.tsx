'use client';

import { useState } from 'react';
import { Search, TrendingUp, Loader2 } from 'lucide-react';

interface StockFormProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

export default function StockForm({ onSearch, isLoading }: StockFormProps) {
  const [ticker, setTicker] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  const popularStocks = [
    { ticker: 'AAPL', name: 'Apple' },
    { ticker: 'MSFT', name: 'Microsoft' },
    { ticker: 'GOOGL', name: 'Google' },
    { ticker: 'TSLA', name: 'Tesla' },
    { ticker: 'AMZN', name: 'Amazon' },
    { ticker: 'META', name: 'Meta' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Stock Analyzer</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Analiza cualquier empresa del mercado bursátil en tiempo real
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Ingresa un ticker (ej: AAPL, MSFT, TSLA)"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !ticker.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Analizar
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sugerencias populares */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">Prueba con estas empresas populares:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularStocks.map((stock) => (
            <button
              key={stock.ticker}
              onClick={() => {
                setTicker(stock.ticker);
                onSearch(stock.ticker);
              }}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock.ticker} - {stock.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}