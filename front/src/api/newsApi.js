const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

export const newsApi = {
  getArticles: async (limit = 12, offset = 0) => {
    try {
      const response = await fetch(`${BASE_URL}/articles/?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
};