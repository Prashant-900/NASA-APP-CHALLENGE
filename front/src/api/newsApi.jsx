const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

const KEYWORDS = ['exoplanet', 'discovery', 'satellite', 'planet', 'earth', 'moon', 'sun', 'space', 'nasa', 'telescope'];

export const newsApi = {
  getArticles: async (limit = 12) => {
    try {
      // Get random keyword and offset for variety
      const randomKeyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
      const randomOffset = Math.floor(Math.random() * 100);
      
      const response = await fetch(`${BASE_URL}/articles/?limit=${limit}&offset=${randomOffset}&search=${randomKeyword}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
};