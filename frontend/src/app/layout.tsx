import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Analyzer - Análisis Bursátil en Tiempo Real',
  description: 'Analiza cualquier empresa del mercado bursátil con información financiera detallada, métricas clave y gráficos de precios históricos.',
  keywords: 'stock, análisis bursátil, finanzas, inversiones, mercado de valores',
  authors: [{ name: 'Tu Nombre' }],
  openGraph: {
    title: 'Stock Analyzer',
    description: 'Análisis bursátil profesional en tiempo real',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}