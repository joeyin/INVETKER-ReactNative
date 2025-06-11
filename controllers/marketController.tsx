import FINNHUB_API_KEY from "@/configs/finnhub";

class MarketController {
  apiURL(): string {
    return `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
  }

  async fetchNews() {
    try {
      const response = await fetch(this.apiURL());
      return await response.json();
    } catch (error) {
      console.error("Fetching News Failed:", error);
      return null;
    }
  }
}

export default new MarketController();
