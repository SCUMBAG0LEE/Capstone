import axios from 'axios';

export default class AuthPage {
  async render() {
    if (localStorage.getItem('token')) { window.location.href = "#/"; return ''; }
    return `
     <div class="home-container">
      <div class="auth-panel" style="background: #18104a url('Images/qq-2.png') center center no-repeat; background-size: cover;">
          <div class="auth-overlay" id="authOverlay"></div>

          <div class="auth-form-container">
            <!-- Login Form -->
            <div class="login-form" id="loginForm">
              <p class="auth-subtitle">Welcome back!</p>
              <h2 style="margin-bottom: 5px;">Login to your Account</h2>
              <input type="text" placeholder="Username / Email" />
              <input type="password" placeholder="Password" />
              <div class="form-options">
                <label><input type="checkbox" /> Remember me </label>
                <a href="#" class="forgot-link">Forgot Password?</a>
              </div>
              <button class="auth-btn">LOG IN</button>
              <div class="toggle-link">
                Don't have an account? <span id="showRegister">Create an account</span>
              </div>
            </div>

            <!-- Register Form -->
            <div class="register-form hidden-form" id="registerForm">
              <p class="auth-subtitle">Unlock all Features!</p>
              <h2 style="margin-bottom: 5px;">Create your account</h2>
              <input type="text" placeholder="Username" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <input type="password" placeholder="Confirm Password" />
              <label><input type="checkbox" /> Accept terms and conditions</label>
              <button class="auth-btn">REGISTER</button>
              <div class="toggle-link">
                You have an account? <span id="showLogin">Login now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authOverlay = document.getElementById('authOverlay');

  // Toggle forms
  document.getElementById('showRegister').addEventListener('click', () => {
    loginForm.classList.add('hidden-form');
    registerForm.classList.remove('hidden-form');
    authOverlay.classList.add('move-right');
  });

  document.getElementById('showLogin').addEventListener('click', () => {
    loginForm.classList.remove('hidden-form');
    registerForm.classList.add('hidden-form');
    authOverlay.classList.remove('move-right');
  });

  // NAV STYLING
  document.getElementById('home').style.textDecoration = 'unset';
  document.getElementById('home').style.color = '#fff';
  document.getElementById('auth').style.textDecoration = 'underline';
  document.getElementById('auth').style.color = '#1da7e7';
  document.getElementById('about').style.textDecoration = 'unset';
  document.getElementById('about').style.color = '#fff';
  document.getElementById('predict').style.textDecoration = 'unset';
  document.getElementById('predict').style.color = '#fff';

  // LOGIN HANDLER
  loginForm.querySelector('.auth-btn').addEventListener('click', async () => {
    const auth = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      const response = await axios.post('http://103.75.25.67:5000/login', {
        auth,
        password,
      });

      alert('Login successful!');
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      window.location.href = "#/";

      // Save token/userId or redirect user here

    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Login failed');
      } else {
        alert('Error connecting to server');
      }
      console.error(error);
    }
  });

  // REGISTER HANDLER
  registerForm.querySelector('.auth-btn').addEventListener('click', async () => {
    const username = registerForm.querySelector('input[placeholder="Username"]').value;
    const email = registerForm.querySelector('input[placeholder="Email"]').value;
    const password = registerForm.querySelectorAll('input[placeholder="Password"]')[0].value;
    const confirmPassword = registerForm.querySelectorAll('input[placeholder="Confirm Password"]')[0].value;
    const consent = registerForm.querySelector('input[type="checkbox"]').checked;

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('http://103.75.25.67:5000/register', {
        email,
        username,
        password,
        consent,
      });

      alert('Registration successful!');
      console.log(response.data);
      // Optional: switch to login form after successful register
      document.getElementById('showLogin').click();

    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Registration failed');
      } else {
        alert('Error connecting to server');
      }
      console.error(error);
    }
  });
}

}
