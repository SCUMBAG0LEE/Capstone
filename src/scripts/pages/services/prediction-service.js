import axios from 'axios';
import endpoint from '../../config'; // Ensure this path is correct

/**
 * Service for handling stock prediction API calls.
 * Acts as the 'Model' layer for prediction data.
 */
class PredictionService {
  /**
   * Sends a prediction request to the backend.
   * @param {string} model_key The key of the prediction model to use.
   * @param {object} payload The financial indicator data for prediction.
   * @param {string} token The authentication token.
   * @returns {Promise<object>} A promise that resolves with the prediction response data.
   * @throws {Error} If the prediction request fails.
   */
  static async getPrediction(model_key, payload, token) {
    try {
      const response = await axios.post(
        `${endpoint.BASE_URL}/predict/${model_key}`, // Using the imported endpoint base URL
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the JWT token for authentication
          },
        }
      );
      return response.data; // Return the prediction result
    } catch (error) {
      console.error('PredictionService error:', error);
      throw error; // Re-throw for presenter to handle
    }
  }
}

export default PredictionService;
