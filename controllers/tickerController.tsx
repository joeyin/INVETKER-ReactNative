import POLYGON_API_KEY from "@/configs/polygon";

class TickerController {
  apiURL(symbol: string): string {
    return `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`;
  }

  async fetchDetail(symbol: string) {
    try {
      const response = await fetch(this.apiURL(symbol));
      const resp = await response.json();
      return resp.results;
    } catch (error) {
      console.error("Fetching Profile Failed:", error);
      return null;
    }
  }
}

export default new TickerController();
