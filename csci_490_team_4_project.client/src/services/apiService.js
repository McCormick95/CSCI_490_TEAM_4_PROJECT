const API_BASE_URL = 'http://localhost:5227/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }
  return response.text().then(text => text ? JSON.parse(text) : {});
};

const apiService = {
  get: async (endpoint, id = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}${id ? `/${id}` : ''}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      console.log('POST request to:', `${API_BASE_URL}/${endpoint}`);
      console.log('Sending data:', data);
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }
};

export default apiService;