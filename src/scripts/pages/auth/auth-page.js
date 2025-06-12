import AuthPagePresenter from '../presenters/auth-page-presenter';
import MessageBox from '../ui/message-box'; // Import the custom message box

export default class AuthPage {
  #presenter = null;
  #loginForm = null;
  #registerForm = null;
  #authOverlay = null;

  /**
   * Renders the HTML content for the Authentication page (Login/Register).
   * If a token exists in local storage, it redirects to the home page.
   * @returns {Promise<string>} A promise that resolves with the HTML string.
   */
  async render() {
    // If user is already authenticated, redirect to home page
    if (localStorage.getItem('token')) {
      window.location.href = "#/";
      return ''; // Return empty string as we are redirecting
    }

    return `
      <div class="home-container">
        <div class="auth-panel" style="background: #18104a url('Images/qq-2.png') center center no-repeat; background-size: cover;">
          <div class="auth-overlay" id="authOverlay"></div>

          <div class="auth-form-container">
            <!-- Login Form -->
            <div class="login-form" id="loginForm">
              <p class="auth-subtitle">Welcome back!</p>
              <h2 style="margin-bottom: 5px;">Login to your Account</h2>
              <input type="text" placeholder="Username / Email" id="loginAuthInput" />
              <input type="password" placeholder="Password" id="loginPasswordInput" />
              <div class="form-options">
                <label><input type="checkbox" id="rememberMeCheckbox" /> Remember me </label>
                <a href="#" class="forgot-link">Forgot Password?</a>
              </div>
              <button class="auth-btn" id="loginBtn">LOG IN</button>
              <div class="toggle-link">
                Don't have an account? <span id="showRegister">Create an account</span>
              </div>
            </div>

            <!-- Register Form -->
            <div class="register-form hidden-form" id="registerForm">
              <p class="auth-subtitle">Unlock all Features!</p>
              <h2 style="margin-bottom: 5px;">Create your account</h2>
              <input type="text" placeholder="Username" id="registerUsernameInput" />
              <input type="email" placeholder="Email" id="registerEmailInput" />
              <input type="password" placeholder="Password" id="registerPasswordInput" />
              <input type="password" placeholder="Confirm Password" id="registerConfirmPasswordInput" />
              <label><input type="checkbox" id="registerConsentCheckbox" /> Accept terms and conditions</label>
              <button class="auth-btn" id="registerBtn">REGISTER</button>
              <div class="toggle-link">
                You have an account? <span id="showLogin">Login now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Executes after the Auth page has been rendered to the DOM.
   * Initializes form elements, attaches event listeners, and sets up the presenter.
   * @returns {Promise<void>} A promise that resolves when afterRender is complete.
   */
  async afterRender() {
    this.#loginForm = document.getElementById('loginForm');
    this.#registerForm = document.getElementById('registerForm');
    this.#authOverlay = document.getElementById('authOverlay');

    // Initialize the presenter with this view (AuthPage instance)
    this.#presenter = new AuthPagePresenter(this);

    // Attach event listeners for toggling forms
    document.getElementById('showRegister').addEventListener('click', () => {
      this.showRegisterForm();
    });

    document.getElementById('showLogin').addEventListener('click', () => {
      this.showLoginForm();
    });

    // Attach event listener for Login button
    document.getElementById('loginBtn').addEventListener('click', () => {
      const auth = document.getElementById('loginAuthInput').value;
      const password = document.getElementById('loginPasswordInput').value;
      this.#presenter.handleLogin(auth, password);
    });

    // Attach event listener for Register button
    document.getElementById('registerBtn').addEventListener('click', () => {
      const username = document.getElementById('registerUsernameInput').value;
      const email = document.getElementById('registerEmailInput').value;
      const password = document.getElementById('registerPasswordInput').value;
      const confirmPassword = document.getElementById('registerConfirmPasswordInput').value;
      const consent = document.getElementById('registerConsentCheckbox').checked;
      this.#presenter.handleRegister(username, email, password, confirmPassword, consent);
    });

    // The navigation highlighting logic is now handled in App.js's _highlightActiveNavLink method.
    // This reduces duplication and centralizes navigation state management.
    // The previous code directly manipulating styles here is removed.
  }

  /**
   * Displays an error message using the custom message box.
   * @param {string} message The error message to display.
   */
  displayError(message) {
    MessageBox.show(message, 'error');
  }

  /**
   * Displays a success message using the custom message box.
   * @param {string} message The success message to display.
   */
  displaySuccess(message) {
    MessageBox.show(message, 'success');
  }

  /**
   * Shows the register form and hides the login form, animating the overlay.
   */
  showRegisterForm() {
    this.#loginForm.classList.add('hidden-form');
    this.#registerForm.classList.remove('hidden-form');
    this.#authOverlay.classList.add('move-right');
  }

  /**
   * Shows the login form and hides the register form, animating the overlay.
   */
  showLoginForm() {
    this.#loginForm.classList.remove('hidden-form');
    this.#registerForm.classList.add('hidden-form');
    this.#authOverlay.classList.remove('move-right');
  }

  /**
   * Redirects the user to a specified URL.
   * @param {string} url The URL hash to redirect to.
   */
  redirectTo(url) {
    window.location.hash = url;
  }
}
