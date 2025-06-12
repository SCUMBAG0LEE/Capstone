import PredictionService from '../services/prediction-service'; // Import the Prediction Service

/**
 * Presenter for the PredictPage.
 * Handles the business logic for getting stock predictions.
 */
export default class PredictPagePresenter {
  #view = null; // Reference to the PredictPage view

  /**
   * Creates an instance of PredictPagePresenter.
   * @param {object} view The PredictPage instance (view).
   */
  constructor(view) {
    this.#view = view;
  }

  /**
   * Handles the request to get a stock prediction.
   * @param {string} model_key The selected prediction model key.
   * @param {object} payload The input financial indicator data.
   */
  async handlePrediction(model_key, payload) {
    // Basic input validation: Check if all payload values are valid numbers
    for (const key in payload) {
      if (isNaN(payload[key])) {
        this.#view.displayError(`Please enter valid numbers for all fields. Missing or invalid: ${key}`);
        return;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.#view.displayError('Authentication token not found. Please log in.');
      this.#view.redirectTo('#/auth'); // Redirect to auth page if token is missing
      return;
    }

    this.#view.setLoadingState(true); // Show loading state on the button

    try {
      // Call the predict method from the Prediction Service
      const response = await PredictionService.getPrediction(model_key, payload, token);
      this.#view.displayPredictionResult(response); // Display the prediction data
    } catch (error) {
      // Display error message from the service or a generic one
      const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred during prediction.';
      this.#view.displayError(`Prediction failed: ${errorMessage}`);
      console.error('Prediction error:', error);
    } finally {
      this.#view.setLoadingState(false); // Hide loading state
    }
  }
}
