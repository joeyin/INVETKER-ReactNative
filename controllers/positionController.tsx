import FINNHUB_API_KEY from "../configs/finnhub";
import { Position } from "../models/Position";
import { Transaction } from "../models/Transaction";

enum Endpoint {
  PROFILE = "PROFILE",
  QUOTE = "QUOTE",
  DESCRIPTION = "DESCRIPTION",
}

class PositionController {
  apiURL(endpoint: Endpoint, symbol: string): string {
    switch (endpoint) {
      case Endpoint.PROFILE:
        return `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      case Endpoint.QUOTE:
      case Endpoint.DESCRIPTION:
        return `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    }
  }

  async all(transactions: Transaction[]) {
    let data: Record<string, Position> = {};

    transactions.forEach((t) => {
      if (!data[t.ticker]) {
        data[t.ticker] = {
          ticker: t.ticker,
          position: 0,
          price: 0,
          change: 0,
          cost: 0,
          marketValue: 0,
          avgPrice: 0,
          dailyProfit: 0,
          unrealizedProfit: 0,
          weburl: "",
          logo: "",
          company: "",
          industry: "",
        };
      }

      const amount = t.price * t.quantity + t.fee;

      if (t.action === "BUY") {
        data[t.ticker].position += t.quantity;
        data[t.ticker].cost += amount;
      } else {
        data[t.ticker].position -= t.quantity;
        data[t.ticker].cost -= amount;
      }
    });

    await Promise.all(
      Object.keys(data).map(async (key) => {
        if (data[key].position > 0) {
          const [profile, quote] = await Promise.all([
            this.fetchProfile(key),
            this.fetchQuote(key),
          ]);

          if (profile) {
            data[key] = { ...data[key], ...profile };
          }

          if (quote) {
            data[key] = {
              ...data[key],
              price: quote.c,
              change: quote.dp,
              marketValue: quote.c * data[key].position,
              dailyProfit: quote.d * data[key].position,
              avgPrice: data[key].cost / data[key].position,
              unrealizedProfit: quote.c * data[key].position - data[key].cost,
            };
          }
        }
      })
    );

    return Object.values(data);
  }

  async fetchProfile(symbol: string) {
    try {
      const response = await fetch(this.apiURL(Endpoint.PROFILE, symbol));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const profile = await response.json();
      return {
        company: profile.name,
        logo: profile.logo,
        industry: profile.finnhubIndustry,
        weburl: profile.weburl,
      };
    } catch (error) {
      console.error("Fetching Profile Failed:", error);
      return error;
    }
  }

  async fetchQuote(symbol: string) {
    try {
      const response = await fetch(this.apiURL(Endpoint.QUOTE, symbol));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetching Quote Failed:", error);
      return error;
    }
  }
}

export default new PositionController();
