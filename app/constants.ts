const baseURL: string =
  process.env.NODE_ENV === 'production' ? 'https://rssfilter-a7aj2utffa-uc.a.run.app' : 'http://localhost:8000';
const corsProxy: string = 'https://cors-anywhere.herokuapp.com/';

export { baseURL, corsProxy };
