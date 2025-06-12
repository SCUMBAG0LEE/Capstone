import { routes, NotFoundPage } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import MessageBox from './ui/message-box'; // Import the custom message box

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

  /**
   * Sets up event listeners for the navigation drawer.
   * - Toggles the drawer open/close when the drawer button is clicked.
   * - Closes the drawer when clicking outside it or on a navigation link.
   */
  _setupDrawer() {
    // Event listener for the drawer button to toggle the 'open' class
    this.#drawerButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent click from bubbling up to body
      this.#navigationDrawer.classList.toggle('open');
    });

    // Event listener on the body to close the drawer if a click occurs outside it
    document.body.addEventListener('click', (event) => {
      // Check if the click target is not inside the navigation drawer and not the drawer button itself
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }
    });

    // Event listener for each navigation link to close the drawer when a link is clicked
    this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        // Only close if the link itself was clicked, not its parent LI
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  /**
   * Renders the appropriate page based on the current URL hash.
   * Also handles authentication-based navigation link visibility and logout functionality.
   */
  async renderPage() {
    // Get the active route from the URL hash
    const url = getActiveRoute();
    // Determine which page to render based on the route, default to NotFoundPage
    const page = routes[url] || new NotFoundPage();

    // Render the page content into the main content area
    this.#content.innerHTML = await page.render();
    // Execute any post-render logic for the page
    await page.afterRender();

    // --- Authentication and Logout Logic for Navigation Links ---
    const authLink = document.getElementById('auth');
    const predictLink = document.getElementById('predict');
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // Update Auth/Logout link
    if (authLink) {
      // Clone and replace to remove existing event listeners before re-attaching
      const newAuthLink = authLink.cloneNode(true);
      authLink.parentNode.replaceChild(newAuthLink, authLink);

      if (token) {
        // If logged in, change text to 'Logout' and set up logout functionality
        newAuthLink.textContent = 'Logout';
        newAuthLink.href = '#/'; // Redirect to home after logout
        newAuthLink.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link behavior
          localStorage.removeItem('token'); // Remove the token
          MessageBox.show('You have been logged out.', 'info'); // Show info message
          window.location.hash = '#/auth'; // Redirect to auth page
        });
      } else {
        // If not logged in, ensure text is 'Auth' and link to auth page
        newAuthLink.textContent = 'Auth';
        newAuthLink.href = '#/auth';
      }
    }

    // Control visibility of the 'Predict' link
    if (predictLink) {
      if (!token) {
        // If no token, hide the predict link
        predictLink.style.display = 'none';
      } else {
        // If token exists, show the predict link
        predictLink.style.display = 'block';
      }
    }

    // Highlight the active navigation link
    this._highlightActiveNavLink(url);
  }

  /**
   * Highlights the active navigation link based on the current URL hash.
   * @param {string} currentUrl The current URL hash.
   */
  _highlightActiveNavLink(currentUrl) {
    // Get all navigation links
    const navLinks = this.#navigationDrawer.querySelectorAll('.nav-list li a');
    navLinks.forEach(link => {
      // Remove previous active styles
      link.style.textDecoration = 'unset';
      link.style.color = '#fff';

      // Check if the link's hash matches the current URL
      const linkHash = link.getAttribute('href').replace('#', '');
      if (currentUrl === linkHash || (currentUrl === '' && linkHash === '/')) {
        // Apply active styles
        link.style.textDecoration = 'underline';
        link.style.color = '#1da7e7';
      }
    });
  }
}

export default App;
