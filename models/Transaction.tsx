export enum Action {
  BUY = "BUY",
  SELL = "SELL",
}

export interface Transaction {
  id: string;
  userId: string;
  ticker: string;
  quantity: number;
  action: Action;
  price: number;
  fee: number;
  date: Date;
}

export interface NewTransaction
  extends Omit<Transaction, "id" | "userId" | "date"> {
  id?: string;
  userId?: string;
  date: number;
}
