import POLYGON_API_KEY from "@/configs/polygon";
import FINNHUB_API_KEY from "@/configs/finnhub";
import { Quote } from "@/models/Quote";
import { Ticker } from "@/models/Ticker";
import { News } from "@/models/News";
import moment from "moment";

enum Endpoint {
  PROFILE = "PROFILE",
  QUOTE = "QUOTE",
  NEWS = "NEWS",
}

class TickerController {
  apiURL(endpoint: Endpoint, symbol: string): string {
    switch (endpoint) {
      case Endpoint.PROFILE:
        return `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`;
      case Endpoint.QUOTE:
        return `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      case Endpoint.NEWS:
        return `https://finnhub.io/api/v1/company-news?symbol=${symbol}&token=${FINNHUB_API_KEY}&from=${moment()
          .day(-7)
          .format("YYYY-MM-DD")}&to=${moment().format("YYYY-MM-DD")}`;
    }
  }

  async profile(symbol: string): Promise<Ticker> {
    try {
      const response = await fetch(this.apiURL(Endpoint.PROFILE, symbol));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resp = await response.json();
      return resp.results;
    } catch (error) {
      console.error("Fetching Profile Failed:", error);
      return null;
    }
  }

  async quote(symbol: string): Promise<Quote> {
    try {
      const response = await fetch(this.apiURL(Endpoint.QUOTE, symbol));
      return await response.json();
    } catch (error) {
      console.error("Fetching Quote Failed:", error);
      return error;
    }
  }

  async news(symbol: string): Promise<News[]> {
    try {
      const response = await fetch(this.apiURL(Endpoint.NEWS, symbol));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetching News Failed:", error);
      return error;
    }
  }
}

export default new TickerController();
