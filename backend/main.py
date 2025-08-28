from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Stock Analyzer API",
    description="API para obtener información financiera de empresas",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_number(value: float, is_currency: bool = False, is_percentage: bool = False) -> str:
    """Formatear números para mostrar de forma legible"""
    if value is None or value == 0:
        return "N/A"
    
    if is_percentage:
        return f"{value:.2f}%"
    
    if is_currency:
        if value >= 1e12:  # Trillones
            return f"${value/1e12:.2f}T"
        elif value >= 1e9:  # Billones
            return f"${value/1e9:.2f}B"
        elif value >= 1e6:  # Millones
            return f"${value/1e6:.2f}M"
        else:
            return f"${value:,.2f}"
    
    if value >= 1e9:
        return f"{value/1e9:.2f}B"
    elif value >= 1e6:
        return f"{value/1e6:.2f}M"
    else:
        return f"{value:,.0f}"

@app.get("/")
async def root():
    return {"message": "Stock Analyzer API - Funcionando correctamente"}

@app.get("/company-info")
async def get_company_info(ticker: str):
    """
    Obtener información completa de una empresa por ticker
    """
    try:
        # Crear objeto yfinance
        stock = yf.Ticker(ticker.upper())
        
        # Obtener información de la empresa
        info = stock.info
        
        # Verificar si el ticker es válido
        if not info or 'symbol' not in info:
            raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' no encontrado")
        
        # Obtener datos históricos para el gráfico (1 año)
        hist = stock.history(period="1y", interval="1d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No hay datos históricos para '{ticker}'")
        
        # Preparar datos del gráfico
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(float(row['Close']), 2),
                "volume": int(row['Volume']) if not pd.isna(row['Volume']) else 0
            })
        
        # Extraer información clave con manejo de errores
        def safe_get(key: str, default = None):
            return info.get(key, default)
        
        # Preparar respuesta
        company_data = {
            "ticker": ticker.upper(),
            "companyName": safe_get('longName') or safe_get('shortName', 'N/A'),
            "sector": safe_get('sector', 'N/A'),
            "industry": safe_get('industry', 'N/A'),
            "currentPrice": safe_get('currentPrice') or safe_get('regularMarketPrice', 0),
            "marketCap": safe_get('marketCap', 0),
            "totalRevenue": safe_get('totalRevenue', 0),
            "netIncome": safe_get('netIncomeToCommon', 0),
            "peRatio": safe_get('trailingPE'),
            "dividendYield": safe_get('dividendYield'),
            "website": safe_get('website', ''),
            "summary": safe_get('longBusinessSummary', ''),
            "employees": safe_get('fullTimeEmployees', 0),
            "country": safe_get('country', 'N/A'),
            "currency": safe_get('currency', 'USD'),
            
            # Métricas formateadas para mostrar
            "metrics": {
                "marketCapFormatted": format_number(safe_get('marketCap', 0), is_currency=True),
                "revenueFormatted": format_number(safe_get('totalRevenue', 0), is_currency=True),
                "netIncomeFormatted": format_number(safe_get('netIncomeToCommon', 0), is_currency=True),
                "peRatioFormatted": f"{safe_get('trailingPE', 0):.2f}" if safe_get('trailingPE') else "N/A",
                "dividendYieldFormatted": format_number((safe_get('dividendYield', 0) * 100), is_percentage=True) if safe_get('dividendYield') else "N/A",
                "employeesFormatted": format_number(safe_get('fullTimeEmployees', 0)),
                "currentPriceFormatted": f"${safe_get('currentPrice', 0):.2f}" if safe_get('currentPrice') else f"${safe_get('regularMarketPrice', 0):.2f}"
            },
            
            # Datos del gráfico
            "chartData": chart_data[-252:] if len(chart_data) > 252 else chart_data,  # Último año (252 días de trading)
            
            # Metadata
            "lastUpdated": datetime.now().isoformat(),
            "dataSource": "Yahoo Finance via yfinance"
        }
        
        logger.info(f"Información obtenida exitosamente para {ticker}")
        return company_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo información para {ticker}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno del servidor: {str(e)}"
        )

@app.get("/search-suggestions")
async def get_search_suggestions(query: str):
    """
    Obtener sugerencias de tickers basadas en una búsqueda
    """
    try:
        # Lista de tickers populares para sugerencias rápidas
        popular_stocks = [
            {"ticker": "AAPL", "name": "Apple Inc."},
            {"ticker": "MSFT", "name": "Microsoft Corporation"},
            {"ticker": "GOOGL", "name": "Alphabet Inc."},
            {"ticker": "AMZN", "name": "Amazon.com Inc."},
            {"ticker": "TSLA", "name": "Tesla Inc."},
            {"ticker": "META", "name": "Meta Platforms Inc."},
            {"ticker": "NVDA", "name": "NVIDIA Corporation"},
            {"ticker": "NFLX", "name": "Netflix Inc."},
            {"ticker": "BABA", "name": "Alibaba Group"},
            {"ticker": "V", "name": "Visa Inc."},
        ]
        
        query_upper = query.upper()
        suggestions = [
            stock for stock in popular_stocks 
            if query_upper in stock["ticker"] or query_upper in stock["name"].upper()
        ]
        
        return {"suggestions": suggestions[:5]}  # Limitar a 5 sugerencias
        
    except Exception as e:
        logger.error(f"Error en búsqueda de sugerencias: {str(e)}")
        return {"suggestions": []}

# Importar pandas para manejo de datos
import pandas as pd

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)