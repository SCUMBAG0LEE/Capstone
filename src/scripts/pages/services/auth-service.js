import axios from 'axios';
import endpoint from '../../config'; // Ensure this path is correct

/**
 * Service for handling authentication-related API calls.
 * Acts as the 'Model' layer for authentication data.
 */
class AuthService {
  /**
   * Sends a login request to the backend.
   * @param {string} auth The username or email.
   * @param {string} password The user's password.
   * @returns {Promise<object>} A promise that resolves with the login response data (e.g., token).
   * @throws {Error} If the login request fails.
   */
  static async login(auth, password) {
    try {
      const response = await axios.post(`${endpoint.BASE_URL}/login`, {
        auth,
        password,
      });
      return response.data; // Return data containing token etc.
    } catch (error) {
      console.error('AuthService login error:', error);
      throw error; // Re-throw for presenter to handle
    }
  }

  /**
   * Sends a registration request to the backend.
   * @param {string} username The desired username.
   * @param {string} email The user's email.
   * @param {string} password The user's password.
   * @param {boolean} consent User's consent to terms.
   * @returns {Promise<object>} A promise that resolves with the registration response data.
   * @throws {Error} If the registration request fails.
   */
  static async register(username, email, password, consent) {
    try {
      const response = await axios.post(`${endpoint.BASE_URL}/register`, {
        email,
        username,
        password,
        consent,
      });
      return response.data; // Return registration success data
    } catch (error) {
      console.error('AuthService register error:', error);
      throw error; // Re-throw for presenter to handle
    }
  }
}

export default AuthService;
