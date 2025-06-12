import axios from 'axios'; // Import axios for making HTTP requests
import endpoint from '../../config'; // Import the endpoint configuration

export default class PredictPage {
  async render() {
    if (!localStorage.getItem('token')) {
      window.location.href = "#/auth";
      return '';
    }
    return `
      <div class="home-container">
        <div class="predict-main">
          <div class="predict-input-panel">
            <h2>Stock Prediction</h2>
            <p>Enter the stock's financial indicators to get a trading signal.</p>

            <select id="modelSelect" class="predict-input">
              <option value="rf">Random Forest (rf)</option>
              <option value="lr">Logistic Regression (lr)</option>
              <option value="knn">K-Nearest Neighbors (knn)</option>
              <option value="dt">Decision Tree (dt)</option>
              <option value="nb">Naive Bayes (nb)</option>
            </select>

            <input class="predict-input" type="number" step="0.01" placeholder="Close Price" id="closeInput" required />
            <input class="predict-input" type="number" step="0.01" placeholder="RSI" id="rsiInput" required />
            <input class="predict-input" type="number" step="0.01" placeholder="MACD" id="macdInput" required />
            <input class="predict-input" type="number" step="0.01" placeholder="MACD Signal" id="macdSignalInput" required />
            <input class="predict-input" type="number" step="0.01" placeholder="SMA 20" id="sma20Input" required />
            <input class="predict-input" type="number" step="0.01" placeholder="EMA 20" id="ema20Input" required />

            <button class="home-btn" id="predictBtn">
              📊 Get Prediction
            </button>
            <div id="predictionResult" class="prediction-result"></div>
            <div id="errorMessage" class="error-message"></div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Highlight nav link for 'predict'
    ['home', 'auth', 'about', 'predict'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.textDecoration = id === 'predict' ? 'underline' : 'unset';
        el.style.color = id === 'predict' ? '#1da7e7' : '#fff';
      }
    });

    // Get elements from the DOM
    const modelSelect = document.getElementById('modelSelect');
    const closeInput = document.getElementById('closeInput');
    const rsiInput = document.getElementById('rsiInput');
    const macdInput = document.getElementById('macdInput');
    const macdSignalInput = document.getElementById('macdSignalInput');
    const sma20Input = document.getElementById('sma20Input');
    const ema20Input = document.getElementById('ema20Input');
    const predictBtn = document.getElementById('predictBtn');
    const predictionResultDiv = document.getElementById('predictionResult');
    const errorMessageDiv = document.getElementById('errorMessage');

    // Remove chart related elements, as they are no longer needed with the new backend
    const chartPanel = document.querySelector('.predict-chart-panel');
    if (chartPanel) chartPanel.remove();

    // Add event listener for the prediction button click
    predictBtn.addEventListener('click', async () => {
      predictionResultDiv.textContent = ''; // Clear previous results
      errorMessageDiv.textContent = ''; // Clear previous errors

      // Retrieve authentication token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        errorMessageDiv.textContent = 'Authentication token not found. Please log in.';
        window.location.href = "#/auth"; // Redirect to auth page if token is missing
        return;
      }

      // Get the selected model key and construct the payload from input fields
      const model_key = modelSelect.value;
      const payload = {
        Close: parseFloat(closeInput.value),
        rsi: parseFloat(rsiInput.value),
        macd: parseFloat(macdInput.value),
        macd_signal: parseFloat(macdSignalInput.value),
        sma_20: parseFloat(sma20Input.value),
        ema_20: parseFloat(ema20Input.value),
      };

      // Basic input validation: Check if all payload values are valid numbers
      for (const key in payload) {
        if (isNaN(payload[key])) {
          errorMessageDiv.textContent = `Please enter valid numbers for all fields. Missing or invalid: ${key}`;
          return;
        }
      }

      try {
        predictBtn.disabled = true; // Disable button to prevent multiple clicks
        predictBtn.textContent = 'Predicting...'; // Update button text to indicate loading

        // Make the POST request to the Hapi.js backend's prediction endpoint
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

        // Handle successful prediction response
        if (response.status === 200) {
          const { model_used, prediction_numeric, prediction_label } = response.data;
          // Display the prediction result
          predictionResultDiv.innerHTML = `
            <h3>Prediction Result:</h3>
            <p><strong>Model Used:</strong> ${model_used}</p>
            <p><strong>Numeric Prediction:</strong> ${prediction_numeric}</p>
            <p><strong>Trading Signal:</strong> <span style="font-weight: bold; color: ${prediction_label === 'Buy' ? 'green' : prediction_label === 'Sell' ? 'red' : 'orange'};">${prediction_label}</span></p>
          `;
        } else {
          // Handle unexpected non-200 responses
          errorMessageDiv.textContent = `Prediction failed: ${response.data.error || 'Unknown error'}`;
        }
      } catch (error) {
        console.error('Error during prediction:', error);
        if (error.response) {
          // The API responded with an error status code and possibly a message
          errorMessageDiv.textContent = `Error: ${error.response.data.error || error.response.statusText || 'An error occurred'}`;
        } else if (error.request) {
          // The request was made but no response was received (e.g., network error, server down)
          errorMessageDiv.textContent = 'No response from server. Prediction service might be unavailable.';
        } else {
          // Something else happened while setting up the request that triggered an Error
          errorMessageDiv.textContent = `An unexpected error occurred: ${error.message}`;
        }
      } finally {
        predictBtn.disabled = false; // Re-enable the button
        predictBtn.textContent = '📊 Get Prediction'; // Reset button text
      }
    });
  }
}
