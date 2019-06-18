const baseURL: string =
  process.env.NODE_ENV === 'production' ? 'https://app.rssfilter.xyz' : 'http://localhost:8000';
const corsProxy: string = 'https://cors-anywhere.herokuapp.com/';

export { baseURL, corsProxy };
