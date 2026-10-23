export interface SectorItem {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  subSector?: string;
  marketCap: number; // in Billions USD
  perf1D: number;
  perf1W: number;
  perf1M: number;
  perfYTD: number;
  volume: string;
  peRatio: number;
}

export interface SectorGroup {
  name: string;
  id: string;
  perf1D: number;
  perf1W: number;
  perf1M: number;
  perfYTD: number;
  marketCap: number; // in Billions USD
  items: SectorItem[];
}

export const SECTOR_DATA: SectorGroup[] = [
  {
    name: 'Technology',
    id: 'tech',
    perf1D: 2.15,
    perf1W: 3.84,
    perf1M: 6.42,
    perfYTD: 28.5,
    marketCap: 14200,
    items: [
      { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', subSector: 'Semiconductors', marketCap: 3400, perf1D: 3.82, perf1W: 6.15, perf1M: 11.2, perfYTD: 142.0, volume: '112M', peRatio: 52.4 },
      { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', subSector: 'Consumer Electronics', marketCap: 3580, perf1D: 1.45, perf1W: 2.30, perf1M: 4.8, perfYTD: 22.4, volume: '58M', peRatio: 33.1 },
      { id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', subSector: 'Software Infrastructure', marketCap: 3140, perf1D: 0.92, perf1W: 1.85, perf1M: 3.6, perfYTD: 18.2, volume: '22M', peRatio: 35.8 },
      { id: 'avgo', symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Technology', subSector: 'Semiconductors', marketCap: 840, perf1D: 2.65, perf1W: 4.20, perf1M: 8.5, perfYTD: 54.1, volume: '14M', peRatio: 41.2 },
      { id: 'orcl', symbol: 'ORCL', name: 'Oracle Corp', sector: 'Technology', subSector: 'Software Infrastructure', marketCap: 480, perf1D: 1.95, perf1W: 3.10, perf1M: 9.8, perfYTD: 68.5, volume: '18M', peRatio: 38.6 },
      { id: 'amd', symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', subSector: 'Semiconductors', marketCap: 250, perf1D: 3.12, perf1W: 5.40, perf1M: 7.2, perfYTD: 31.8, volume: '48M', peRatio: 45.2 },
      { id: 'crm', symbol: 'CRM', name: 'Salesforce Inc', sector: 'Technology', subSector: 'Software Application', marketCap: 280, perf1D: 0.65, perf1W: 1.20, perf1M: 4.1, perfYTD: 14.5, volume: '8M', peRatio: 42.0 },
      { id: 'adbe', symbol: 'ADBE', name: 'Adobe Inc', sector: 'Technology', subSector: 'Software Application', marketCap: 230, perf1D: -0.45, perf1W: -1.20, perf1M: 2.1, perfYTD: -4.8, volume: '6M', peRatio: 36.4 },
    ]
  },
  {
    name: 'Communication Services',
    id: 'comm',
    perf1D: 1.72,
    perf1W: 2.95,
    perf1M: 5.10,
    perfYTD: 24.8,
    marketCap: 5800,
    items: [
      { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc Class A', sector: 'Communication Services', subSector: 'Internet Content', marketCap: 2050, perf1D: 1.62, perf1W: 3.15, perf1M: 4.9, perfYTD: 21.6, volume: '24M', peRatio: 24.2 },
      { id: 'meta', symbol: 'META', name: 'Meta Platforms Inc', sector: 'Communication Services', subSector: 'Internet Content', marketCap: 1480, perf1D: 2.18, perf1W: 4.10, perf1M: 7.8, perfYTD: 64.2, volume: '19M', peRatio: 27.5 },
      { id: 'nflx', symbol: 'NFLX', name: 'Netflix Inc', sector: 'Communication Services', subSector: 'Entertainment', marketCap: 310, perf1D: 1.25, perf1W: 2.80, perf1M: 6.4, perfYTD: 42.1, volume: '5M', peRatio: 40.1 },
      { id: 'dis', symbol: 'DIS', name: 'Walt Disney Co', sector: 'Communication Services', subSector: 'Entertainment', marketCap: 175, perf1D: -0.52, perf1W: 0.40, perf1M: 1.8, perfYTD: 6.2, volume: '9M', peRatio: 18.5 },
      { id: 't', symbol: 'T', name: 'AT&T Inc', sector: 'Communication Services', subSector: 'Telecom Services', marketCap: 155, perf1D: 0.35, perf1W: 0.90, perf1M: 2.5, perfYTD: 28.4, volume: '32M', peRatio: 9.8 },
      { id: 'vz', symbol: 'VZ', name: 'Verizon Communications', sector: 'Communication Services', subSector: 'Telecom Services', marketCap: 180, perf1D: 0.15, perf1W: 0.60, perf1M: 1.9, perfYTD: 14.8, volume: '22M', peRatio: 10.2 }
    ]
  },
  {
    name: 'Consumer Discretionary',
    id: 'disc',
    perf1D: 0.85,
    perf1W: 1.25,
    perf1M: 3.10,
    perfYTD: 15.6,
    marketCap: 4900,
    items: [
      { id: 'amzn', symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Discretionary', subSector: 'Internet Retail', marketCap: 1950, perf1D: 1.82, perf1W: 3.40, perf1M: 5.6, perfYTD: 24.1, volume: '42M', peRatio: 44.5 },
      { id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Discretionary', subSector: 'Automotive', marketCap: 698, perf1D: -1.74, perf1W: -2.80, perf1M: 4.1, perfYTD: -11.5, volume: '74M', peRatio: 64.2 },
      { id: 'hd', symbol: 'HD', name: 'Home Depot Inc', sector: 'Consumer Discretionary', subSector: 'Home Improvement', marketCap: 410, perf1D: 0.52, perf1W: 1.10, perf1M: 3.2, perfYTD: 16.4, volume: '4M', peRatio: 26.5 },
      { id: 'mcd', symbol: 'MCD', name: 'McDonalds Corp', sector: 'Consumer Discretionary', subSector: 'Restaurants', marketCap: 215, perf1D: -0.42, perf1W: 0.20, perf1M: 2.8, perfYTD: 3.4, volume: '3M', peRatio: 25.1 },
      { id: 'nke', symbol: 'NKE', name: 'Nike Inc', sector: 'Consumer Discretionary', subSector: 'Footwear & Apparel', marketCap: 125, perf1D: -1.85, perf1W: -3.40, perf1M: -5.2, perfYTD: -24.8, volume: '11M', peRatio: 22.8 },
      { id: 'bkng', symbol: 'BKNG', name: 'Booking Holdings', sector: 'Consumer Discretionary', subSector: 'Travel Services', marketCap: 150, perf1D: 1.15, perf1W: 2.10, perf1M: 4.8, perfYTD: 21.2, volume: '1M', peRatio: 28.4 }
    ]
  },
  {
    name: 'Financials',
    id: 'fin',
    perf1D: 0.94,
    perf1W: 2.10,
    perf1M: 4.50,
    perfYTD: 22.1,
    marketCap: 4400,
    items: [
      { id: 'jpm', symbol: 'JPM', name: 'JPMorgan Chase & Co', sector: 'Financials', subSector: 'Diversified Banking', marketCap: 640, perf1D: 1.15, perf1W: 2.80, perf1M: 5.4, perfYTD: 29.5, volume: '12M', peRatio: 12.4 },
      { id: 'v', symbol: 'V', name: 'Visa Inc Class A', sector: 'Financials', subSector: 'Credit Services', marketCap: 560, perf1D: 0.42, perf1W: 1.10, perf1M: 2.9, perfYTD: 11.8, volume: '6M', peRatio: 30.2 },
      { id: 'ma', symbol: 'MA', name: 'Mastercard Inc', sector: 'Financials', subSector: 'Credit Services', marketCap: 470, perf1D: 0.65, perf1W: 1.40, perf1M: 3.2, perfYTD: 14.5, volume: '3M', peRatio: 32.1 },
      { id: 'bac', symbol: 'BAC', name: 'Bank of America Corp', sector: 'Financials', subSector: 'Diversified Banking', marketCap: 330, perf1D: 0.85, perf1W: 2.20, perf1M: 4.8, perfYTD: 26.2, volume: '38M', peRatio: 13.8 },
      { id: 'wfc', symbol: 'WFC', name: 'Wells Fargo & Co', sector: 'Financials', subSector: 'Diversified Banking', marketCap: 210, perf1D: 1.40, perf1W: 3.10, perf1M: 6.2, perfYTD: 24.8, volume: '16M', peRatio: 11.9 },
      { id: 'gs', symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Financials', subSector: 'Investment Banking', marketCap: 175, perf1D: 1.85, perf1W: 3.90, perf1M: 7.8, perfYTD: 34.1, volume: '4M', peRatio: 15.2 },
      { id: 'ms', symbol: 'MS', name: 'Morgan Stanley', sector: 'Financials', subSector: 'Investment Banking', marketCap: 190, perf1D: 1.60, perf1W: 3.40, perf1M: 6.9, perfYTD: 28.9, volume: '7M', peRatio: 16.5 }
    ]
  },
  {
    name: 'Healthcare',
    id: 'health',
    perf1D: -0.32,
    perf1W: -0.65,
    perf1M: 0.85,
    perfYTD: 8.4,
    marketCap: 4100,
    items: [
      { id: 'lly', symbol: 'LLY', name: 'Eli Lilly and Co', sector: 'Healthcare', subSector: 'Drug Manufacturers', marketCap: 880, perf1D: 2.40, perf1W: 4.50, perf1M: 7.8, perfYTD: 62.4, volume: '3M', peRatio: 68.2 },
      { id: 'unh', symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', subSector: 'Healthcare Plans', marketCap: 540, perf1D: -0.85, perf1W: -1.40, perf1M: 0.5, perfYTD: 11.2, volume: '4M', peRatio: 26.4 },
      { id: 'jnj', symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', subSector: 'Drug Manufacturers', marketCap: 390, perf1D: -0.22, perf1W: -0.50, perf1M: 1.1, perfYTD: 4.8, volume: '8M', peRatio: 16.1 },
      { id: 'abbv', symbol: 'ABBV', name: 'AbbVie Inc', sector: 'Healthcare', subSector: 'Drug Manufacturers', marketCap: 340, perf1D: 0.45, perf1W: 1.20, perf1M: 3.4, perfYTD: 24.5, volume: '5M', peRatio: 17.8 },
      { id: 'mrk', symbol: 'MRK', name: 'Merck & Co Inc', sector: 'Healthcare', subSector: 'Drug Manufacturers', marketCap: 280, perf1D: -0.95, perf1W: -2.10, perf1M: -3.8, perfYTD: -1.2, volume: '9M', peRatio: 15.6 },
      { id: 'pfe', symbol: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', subSector: 'Drug Manufacturers', marketCap: 165, perf1D: -1.15, perf1W: -2.40, perf1M: -4.5, perfYTD: -8.9, volume: '28M', peRatio: 14.2 }
    ]
  },
  {
    name: 'Energy',
    id: 'energy',
    perf1D: -1.48,
    perf1W: -3.20,
    perf1M: -5.40,
    perfYTD: 3.2,
    marketCap: 1850,
    items: [
      { id: 'xom', symbol: 'XOM', name: 'Exxon Mobil Corp', sector: 'Energy', subSector: 'Oil & Gas Integrated', marketCap: 480, perf1D: -1.42, perf1W: -3.10, perf1M: -4.8, perfYTD: 18.5, volume: '18M', peRatio: 14.5 },
      { id: 'cvx', symbol: 'CVX', name: 'Chevron Corp', sector: 'Energy', subSector: 'Oil & Gas Integrated', marketCap: 285, perf1D: -1.25, perf1W: -2.80, perf1M: -4.2, perfYTD: 2.1, volume: '9M', peRatio: 13.8 },
      { id: 'cop', symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', subSector: 'Oil & Gas E&P', marketCap: 130, perf1D: -1.65, perf1W: -3.50, perf1M: -6.1, perfYTD: -4.8, volume: '6M', peRatio: 12.4 },
      { id: 'slb', symbol: 'SLB', name: 'SLB Ltd (Schlumberger)', sector: 'Energy', subSector: 'Oil & Gas Equipment', marketCap: 65, perf1D: -2.45, perf1W: -5.10, perf1M: -8.2, perfYTD: -16.4, volume: '14M', peRatio: 13.2 },
      { id: 'eog', symbol: 'EOG', name: 'EOG Resources Inc', sector: 'Energy', subSector: 'Oil & Gas E&P', marketCap: 72, perf1D: -1.80, perf1W: -3.80, perf1M: -5.5, perfYTD: 4.5, volume: '4M', peRatio: 11.5 }
    ]
  },
  {
    name: 'Industrials',
    id: 'ind',
    perf1D: 0.65,
    perf1W: 1.85,
    perf1M: 3.80,
    perfYTD: 19.4,
    marketCap: 2600,
    items: [
      { id: 'ge', symbol: 'GE', name: 'GE Aerospace', sector: 'Industrials', subSector: 'Aerospace & Defense', marketCap: 210, perf1D: 1.85, perf1W: 3.90, perf1M: 7.2, perfYTD: 78.4, volume: '7M', peRatio: 38.4 },
      { id: 'cat', symbol: 'CAT', name: 'Caterpillar Inc', sector: 'Industrials', subSector: 'Machinery', marketCap: 195, perf1D: 0.92, perf1W: 2.40, perf1M: 5.6, perfYTD: 34.5, volume: '3M', peRatio: 18.2 },
      { id: 'unp', symbol: 'UNP', name: 'Union Pacific Corp', sector: 'Industrials', subSector: 'Railroads', marketCap: 148, perf1D: 0.45, perf1W: 1.10, perf1M: 2.4, perfYTD: 8.5, volume: '3M', peRatio: 22.1 },
      { id: 'hon', symbol: 'HON', name: 'Honeywell International', sector: 'Industrials', subSector: 'Conglomerates', marketCap: 138, perf1D: 0.35, perf1W: 0.80, perf1M: 1.9, perfYTD: 2.8, volume: '3M', peRatio: 24.0 },
      { id: 'rtx', symbol: 'RTX', name: 'RTX Corp', sector: 'Industrials', subSector: 'Aerospace & Defense', marketCap: 165, perf1D: 0.85, perf1W: 2.10, perf1M: 4.8, perfYTD: 42.1, volume: '5M', peRatio: 28.5 },
      { id: 'ba', symbol: 'BA', name: 'Boeing Co', sector: 'Industrials', subSector: 'Aerospace & Defense', marketCap: 95, perf1D: -2.40, perf1W: -5.60, perf1M: -9.8, perfYTD: -41.2, volume: '18M', peRatio: 0 }
    ]
  },
  {
    name: 'Consumer Staples',
    id: 'staples',
    perf1D: 0.35,
    perf1W: 0.72,
    perf1M: 1.65,
    perfYTD: 13.8,
    marketCap: 2400,
    items: [
      { id: 'wmt', symbol: 'WMT', name: 'Walmart Inc', sector: 'Consumer Staples', subSector: 'Discount Stores', marketCap: 650, perf1D: 0.85, perf1W: 1.80, perf1M: 3.9, perfYTD: 52.4, volume: '16M', peRatio: 34.2 },
      { id: 'pg', symbol: 'PG', name: 'Procter & Gamble Co', sector: 'Consumer Staples', subSector: 'Household Products', marketCap: 400, perf1D: 0.28, perf1W: 0.60, perf1M: 1.4, perfYTD: 16.5, volume: '7M', peRatio: 26.8 },
      { id: 'cost', symbol: 'COST', name: 'Costco Wholesale Corp', sector: 'Consumer Staples', subSector: 'Discount Stores', marketCap: 395, perf1D: 1.15, perf1W: 2.40, perf1M: 4.8, perfYTD: 36.2, volume: '2M', peRatio: 54.1 },
      { id: 'ko', symbol: 'KO', name: 'Coca-Cola Co', sector: 'Consumer Staples', subSector: 'Beverages', marketCap: 290, perf1D: 0.42, perf1W: 0.90, perf1M: 1.8, perfYTD: 14.8, volume: '12M', peRatio: 24.5 },
      { id: 'pep', symbol: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer Staples', subSector: 'Beverages', marketCap: 240, perf1D: 0.18, perf1W: 0.40, perf1M: 0.9, perfYTD: 4.2, volume: '5M', peRatio: 23.1 }
    ]
  },
  {
    name: 'Utilities',
    id: 'util',
    perf1D: 0.52,
    perf1W: 1.15,
    perf1M: 2.80,
    perfYTD: 24.2,
    marketCap: 1100,
    items: [
      { id: 'nee', symbol: 'NEE', name: 'NextEra Energy Inc', sector: 'Utilities', subSector: 'Regulated Electric', marketCap: 170, perf1D: 1.15, perf1W: 2.40, perf1M: 4.8, perfYTD: 38.4, volume: '8M', peRatio: 26.5 },
      { id: 'so', symbol: 'SO', name: 'Southern Co', sector: 'Utilities', subSector: 'Regulated Electric', marketCap: 98, perf1D: 0.42, perf1W: 0.90, perf1M: 2.1, perfYTD: 28.5, volume: '4M', peRatio: 22.1 },
      { id: 'duk', symbol: 'DUK', name: 'Duke Energy Corp', sector: 'Utilities', subSector: 'Regulated Electric', marketCap: 90, perf1D: 0.55, perf1W: 1.10, perf1M: 2.5, perfYTD: 25.1, volume: '3M', peRatio: 21.8 }
    ]
  },
  {
    name: 'Real Estate',
    id: 're',
    perf1D: -0.62,
    perf1W: -1.20,
    perf1M: 0.45,
    perfYTD: 9.8,
    marketCap: 950,
    items: [
      { id: 'pld', symbol: 'PLD', name: 'Prologis Inc', sector: 'Real Estate', subSector: 'Industrial REITs', marketCap: 115, perf1D: -0.65, perf1W: -1.40, perf1M: 0.8, perfYTD: -7.5, volume: '4M', peRatio: 35.2 },
      { id: 'amt', symbol: 'AMT', name: 'American Tower Corp', sector: 'Real Estate', subSector: 'Specialized REITs', marketCap: 105, perf1D: -1.18, perf1W: -2.10, perf1M: -1.2, perfYTD: 8.5, volume: '3M', peRatio: 38.4 },
      { id: 'eqix', symbol: 'EQIX', name: 'Equinix Inc', sector: 'Real Estate', subSector: 'Specialized REITs', marketCap: 85, perf1D: 0.45, perf1W: 1.20, perf1M: 3.1, perfYTD: 14.2, volume: '1M', peRatio: 64.0 }
    ]
  },
  {
    name: 'Basic Materials',
    id: 'mat',
    perf1D: 0.48,
    perf1W: 1.10,
    perf1M: 2.60,
    perfYTD: 11.4,
    marketCap: 920,
    items: [
      { id: 'lin', symbol: 'LIN', name: 'Linde PLC', sector: 'Basic Materials', subSector: 'Specialty Chemicals', marketCap: 220, perf1D: 0.52, perf1W: 1.20, perf1M: 2.8, perfYTD: 16.5, volume: '2M', peRatio: 32.1 },
      { id: 'shw', symbol: 'SHW', name: 'Sherwin-Williams Co', sector: 'Basic Materials', subSector: 'Specialty Chemicals', marketCap: 95, perf1D: 0.35, perf1W: 0.80, perf1M: 2.1, perfYTD: 24.8, volume: '1M', peRatio: 36.4 },
      { id: 'fcx', symbol: 'FCX', name: 'Freeport-McMoRan Inc', sector: 'Basic Materials', subSector: 'Copper & Mining', marketCap: 70, perf1D: 1.95, perf1W: 3.80, perf1M: 7.2, perfYTD: 18.5, volume: '14M', peRatio: 28.5 }
    ]
  }
];
