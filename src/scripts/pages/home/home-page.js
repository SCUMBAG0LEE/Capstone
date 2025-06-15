export default class HomePage {
  /**
   * Renders the HTML content for the Home page.
   * @returns {Promise<string>} A promise that resolves with the HTML string.
   */
  async render() {
    return `
      <div class="home-container">
        <div class="home-main">
          <div class="home-text">
            <p class="home-subtitle">Your stock prediction genie</p>
          </div>
          <img src="Images/qq-1.png" alt="Genie illustration" class="genie-art" />
        </div>
        <img src="Images/hex.png" alt="Hexagon background element" class="hex-1" />
        <div class="circle-1"></div>
      </div>
    `;
  }

  /**
   * Executes after the Home page has been rendered to the DOM.
   * This is typically used for attaching event listeners or performing DOM manipulations.
   * In this case, it's used to highlight the 'Home' link in the navigation.
   * @returns {Promise<void>} A promise that resolves when afterRender is complete.
   */
  async afterRender() {
    // The navigation highlighting logic is now handled in App.js's _highlightActiveNavLink method.
    // This reduces duplication and centralizes navigation state management.
    // The previous code directly manipulating styles here is removed.
  }
}
