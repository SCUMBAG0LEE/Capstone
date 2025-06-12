// CSS imports
import '../styles/styles.css';
// import ensureServiceWorkerRegistered from './pwa.js'; // Assuming pwa.js exists and is handled externally
import App from './pages/app'; // Make sure this path is correct

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the main application
  const app = new App({
    content: document.querySelector('#main-content'), // Main content area where pages are rendered
    drawerButton: document.querySelector('#drawer-button'), // Button to toggle the navigation drawer
    navigationDrawer: document.querySelector('#navigation-drawer'), // The navigation drawer element
  });

  // Render the initial page based on the current URL hash
  await app.renderPage();

  // Add an event listener for hash changes in the URL
  // This allows for single-page application navigation
  window.addEventListener('hashchange', async () => {
    await app.renderPage(); // Re-render the page when the hash changes
  });
});

// The original code had `await ensureServiceWorkerRegistered();` outside DCL.
// Moving it inside DCL or wrapping in an async IIFE is generally safer
// if it relies on DOM, but for simplicity and to match original intent for now,
// assuming it's part of an external setup or handled via module import implicitly.
// If pwa.js needs to be integrated, its content should be provided.
// For now, it's commented out as its content is missing.
// await ensureServiceWorkerRegistered();
