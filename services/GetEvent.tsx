import axios from 'axios';

export const fetchEvents = async () => {
  try {
    const response = await axios.get('/api/proxy');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching events:', error.message);
    throw new Error('Failed to fetch events');
  }
};
