export interface Ticker {
  ticker: string;
  name: string;
  is_etf: boolean | null;
  exchange: string;
}