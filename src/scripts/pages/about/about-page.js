export default class AboutPage {
  /**
   * Renders the HTML content for the About page.
   * @returns {Promise<string>} A promise that resolves with the HTML string.
   */
  async render() {
    return `
      <div class="home-container">
        <h1 style="position: fixed; right: 45%; bottom: 67.5%; z-index: 1">ABOUT US</h1>
        <img src="Images/trapezium.png" alt="Geometric shape" style="width: 25%; height: 25%; position: fixed; right: 40%;"/>
        <div style="display: flex; justify-content: center; margin-top: 40px;">
          <img src="Images/about.gif" alt="About section illustration" style="position: fixed; bottom: 10%; max-width: 500px; height: 50vh; border-radius: 16px; box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);"/>
        </div>
        <img src="Images/hex.png" alt="Hexagon background element" class="hex-2" />
        <div class="circle-2"></div>
      </div>
    `;
  }

  /**
   * Executes after the About page has been rendered to the DOM.
   * This is typically used for attaching event listeners or performing DOM manipulations.
   * In this case, it's used to highlight the 'About' link in the navigation.
   * @returns {Promise<void>} A promise that resolves when afterRender is complete.
   */
  async afterRender() {
    // The navigation highlighting logic is now handled in App.js's _highlightActiveNavLink method.
    // This reduces duplication and centralizes navigation state management.
    // The previous code directly manipulating styles here is removed.
  }
}
