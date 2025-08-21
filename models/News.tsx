export interface News {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: URL;
  source: string;
  summary: string;
  url: URL;
  related?: string;
};
