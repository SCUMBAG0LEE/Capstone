import PredictPagePresenter from '../presenters/predict-page-presenter';
import MessageBox from '../ui/message-box'; // Import the custom message box

export default class PredictPage {
  #presenter = null;
  #modelSelect = null;
  #closeInput = null;
  #rsiInput = null;
  #macdInput = null;
  #macdSignalInput = null;
  #sma20Input = null;
  #ema20Input = null;
  #predictBtn = null;
  #predictionResultDiv = null;

  /**
   * Renders the HTML content for the Prediction page.
   * If no token exists in local storage, it redirects to the authentication page.
   * @returns {Promise<string>} A promise that resolves with the HTML string.
   */
  async render() {
    // Check if the user is authenticated
    if (!localStorage.getItem('token')) {
      window.location.hash = "#/auth"; // Redirect to auth page if no token
      return ''; // Return empty string as we are redirecting
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

            <input class="predict-input" type="number" step="0.01" placeholder="Close Price" id="closeInput" required title="The closing price of the stock." />
            <input class="predict-input" type="number" step="0.01" placeholder="RSI" id="rsiInput" required title="The Relative Strength Index, a momentum indicator." />
            <input class="predict-input" type="number" step="0.01" placeholder="MACD" id="macdInput" required title="Moving Average Convergence Divergence, a trend-following momentum indicator." />
            <input class="predict-input" type="number" step="0.01" placeholder="MACD Signal" id="macdSignalInput" required title="The MACD signal line, a 9-period Exponential Moving Average (EMA) of the MACD line." />
            <input class="predict-input" type="number" step="0.01" placeholder="SMA 20" id="sma20Input" required title="The 20-period Simple Moving Average of the stock's price." />
            <input class="predict-input" type="number" step="0.01" placeholder="EMA 20" id="ema20Input" required title="The 20-period Exponential Moving Average of the stock's price." />

            <button class="home-btn" id="predictBtn">
              📊 Get Prediction
            </button>
            <div id="predictionResult" class="prediction-result"></div>
            <!-- Removed errorMessageDiv as MessageBox will handle errors -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Executes after the Predict page has been rendered to the DOM.
   * Initializes form elements, attaches event listeners, and sets up the presenter.
   * @returns {Promise<void>} A promise that resolves when afterRender is complete.
   */
  async afterRender() {
    // The navigation highlighting logic is now handled in App.js's _highlightActiveNavLink method.
    // The previous code directly manipulating styles here is removed.

    // Get elements from the DOM and assign them to instance variables
    this.#modelSelect = document.getElementById('modelSelect');
    this.#closeInput = document.getElementById('closeInput');
    this.#rsiInput = document.getElementById('rsiInput');
    this.#macdInput = document.getElementById('macdInput');
    this.#macdSignalInput = document.getElementById('macdSignalInput');
    this.#sma20Input = document.getElementById('sma20Input');
    this.#ema20Input = document.getElementById('ema20Input');
    this.#predictBtn = document.getElementById('predictBtn');
    this.#predictionResultDiv = document.getElementById('predictionResult');

    // Remove chart related elements, as they are no longer needed with the new backend
    const chartPanel = document.querySelector('.predict-chart-panel');
    if (chartPanel) chartPanel.remove();

    // Initialize the presenter with this view (PredictPage instance)
    this.#presenter = new PredictPagePresenter(this);

    // Add event listener for the prediction button click
    this.#predictBtn.addEventListener('click', () => {
      this.#predictionResultDiv.textContent = ''; // Clear previous results

      // Get the selected model key and construct the payload from input fields
      const model_key = this.#modelSelect.value;
      const payload = {
        Close: parseFloat(this.#closeInput.value),
        rsi: parseFloat(this.#rsiInput.value),
        macd: parseFloat(this.#macdInput.value),
        macd_signal: parseFloat(this.#macdSignalInput.value),
        sma_20: parseFloat(this.#sma20Input.value),
        ema_20: parseFloat(this.#ema20Input.value),
      };

      this.#presenter.handlePrediction(model_key, payload);
    });
  }

  /**
   * Displays an error message using the custom message box.
   * @param {string} message The error message to display.
   */
  displayError(message) {
    MessageBox.show(message, 'error');
  }

  /**
   * Displays the prediction result on the page.
   * @param {object} data The prediction data (model_used, prediction_numeric, prediction_label).
   */
  displayPredictionResult(data) {
    const { model_used, prediction_numeric, prediction_label } = data;
    this.#predictionResultDiv.innerHTML = `
      <h3>Prediction Result:</h3>
      <p><strong>Model Used:</strong> ${model_used}</p>
      <p><strong>Numeric Prediction:</strong> ${prediction_numeric}</p>
      <p><strong>Trading Signal:</strong> <span style="font-weight: bold; color: ${prediction_label === 'Buy' ? 'green' : prediction_label === 'Sell' ? 'red' : 'orange'};">${prediction_label}</span></p>
    `;
  }

  /**
   * Sets the loading state for the prediction button.
   * @param {boolean} isLoading True to show loading state, false otherwise.
   */
  setLoadingState(isLoading) {
    this.#predictBtn.disabled = isLoading;
    this.#predictBtn.textContent = isLoading ? 'Predicting...' : '📊 Get Prediction';
  }

  /**
   * Redirects the user to a specified URL.
   * @param {string} url The URL hash to redirect to.
   */
  redirectTo(url) {
    window.location.hash = url;
  }
}
