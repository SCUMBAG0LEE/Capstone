import AuthService from '../services/auth-service'; // Import the Auth Service

/**
 * Presenter for the AuthPage.
 * Handles the business logic for user login and registration.
 */
export default class AuthPagePresenter {
  #view = null; // Reference to the AuthPage view

  /**
   * Creates an instance of AuthPagePresenter.
   * @param {object} view The AuthPage instance (view).
   */
  constructor(view) {
    this.#view = view;
  }

  /**
   * Handles user login.
   * @param {string} auth The username or email.
   * @param {string} password The user's password.
   */
  async handleLogin(auth, password) {
    if (!auth || !password) {
      this.#view.displayError('Please enter both username/email and password.');
      return;
    }

    try {
      // Call the login method from the Auth Service
      const response = await AuthService.login(auth, password);
      localStorage.setItem('token', response.token); // Store token on successful login
      this.#view.displaySuccess('Login successful!');
      this.#view.redirectTo('/'); // Redirect to home page
    } catch (error) {
      // Display error message from the service or a generic one
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      this.#view.displayError(errorMessage);
      console.error('Login error:', error);
    }
  }

  /**
   * Handles user registration.
   * @param {string} username The desired username.
   * @param {string} email The user's email address.
   * @param {string} password The user's password.
   * @param {string} confirmPassword The confirmed password.
   * @param {boolean} consent True if the user accepted terms, false otherwise.
   */
  async handleRegister(username, email, password, confirmPassword, consent) {
    if (!username || !email || !password || !confirmPassword) {
      this.#view.displayError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      this.#view.displayError("Passwords don't match.");
      return;
    }

    if (!consent) {
      this.#view.displayError('You must accept the terms and conditions.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      this.#view.displayError('Invalid email address format.');
      return;
    }

    if (password.length < 6) {
      this.#view.displayError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Call the register method from the Auth Service
      await AuthService.register(username, email, password, consent);
      this.#view.displaySuccess('Registration successful! Please log in.');
      this.#view.showLoginForm(); // Switch to login form after successful registration
    } catch (error) {
      // Display error message from the service or a generic one
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      this.#view.displayError(errorMessage);
      console.error('Registration error:', error);
    }
  }
}
