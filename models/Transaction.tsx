export enum Action {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum Symbol {
  TSLA = 'TSLA',
  AAPL = 'AAPL',
  MSFT = 'MSFT',
  HSBC = 'HSBC',
}

export interface Transaction {
  id: string
  userId: string
  ticker: string
  quantity: number
  action: Action
  price: number
  fee: number
  date: Date
}

export interface NewTransaction extends Omit<Transaction, 'id' | 'userId' | 'date'> {
  id?: string;
  userId?: string;
  date: number
}