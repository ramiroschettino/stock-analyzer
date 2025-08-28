export interface StockData {
    ticker: string;
    companyName: string;
    sector: string;
    industry: string;
    currentPrice: number;
    marketCap: number;
    totalRevenue: number;
    netIncome: number;
    peRatio: number | null;
    dividendYield: number | null;
    website: string;
    summary: string;
    employees: number;
    country: string;
    currency: string;
    
    metrics: {
      marketCapFormatted: string;
      revenueFormatted: string;
      netIncomeFormatted: string;
      peRatioFormatted: string;
      dividendYieldFormatted: string;
      employeesFormatted: string;
      currentPriceFormatted: string;
    };
    
    chartData: ChartDataPoint[];
    lastUpdated: string;
    dataSource: string;
  }
  
  export interface ChartDataPoint {
    date: string;
    price: number;
    volume: number;
  }
  
  export interface SearchSuggestion {
    ticker: string;
    name: string;
  }