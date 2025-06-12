export default class NotFoundPage {
  /**
   * Renders the HTML content for the 404 Not Found page.
   * @returns {Promise<string>} A promise that resolves with the HTML string.
   */
  async render() {
    return `
      <div class="home-container" style=" min-height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center">
          <h1 style="color: #fff; font-size: 48px; margin-bottom: 24px;">Not Found</h1>
          <img src="Images/notfound.gif" alt="Not Found illustration" style="max-width: 400px; width: 100%; border-radius: 16px; box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);"/>
        </div>
      </div>
    `;
  }

  /**
   * Executes after the 404 page has been rendered to the DOM.
   * This is typically used for attaching event listeners or performing DOM manipulations.
   * @returns {Promise<void>} A promise that resolves when afterRender is complete.
   */
  async afterRender() {
    // The navigation highlighting logic is now handled in App.js's _highlightActiveNavLink method.
    // This reduces duplication and centralizes navigation state management.
    // The previous code directly manipulating styles here is removed.
  }
}
