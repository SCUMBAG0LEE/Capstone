import { routes, NotFoundPage } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || new NotFoundPage();

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    // --- Add Auth ↔ Logout Toggle Logic ---
    const authLink = document.getElementById('auth');
    const predictLink = document.getElementById('predict');
    if (authLink) {
      // Remove existing listeners (in case of route changes)
      const newAuthLink = authLink.cloneNode(true);
      authLink.parentNode.replaceChild(newAuthLink, authLink);

      if (localStorage.getItem('token')) {
        newAuthLink.textContent = 'Logout';
        newAuthLink.href = '#/';
        newAuthLink.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          alert('You have been logged out.');
          window.location.hash = '#/auth';
        });
      } else {
        newAuthLink.textContent = 'Auth';
        newAuthLink.href = '#/auth';
      }
    }
    if (predictLink && !localStorage.getItem('token')) { 
      predictLink.style.display = 'none'; 
    } else {
      predictLink.style.display = 'block';
    }
  }
}

export default App;
