export default class AboutPage {
  async render() {
    return `
      <div class="home-container">
        <h1 style="position: fixed; right: 45%; bottom: 67.5%; z-index: 1">ABOUT US</h1>
        <img src="/Images/trapezium.png" alt="Title" style="width: 25%; height: 25%; position: fixed; right: 40%;"/>
        <div style="display: flex; justify-content: center; margin-top: 40px;">
          <img src="/Images/about.gif" alt="About" style="position: fixed; bottom: 10%; max-width: 500px; height: 50vh; border-radius: 16px; box-shadow: 0 0 24px #0004;"/>
        </div>
        <img src="Images/hex-2.png" alt="Hex" class="hex-2" />
        <div class="circle-2"></div>
      </div>
    `;
  }

  async afterRender() {
    document.getElementById('home').style.textDecoration = 'unset';
    document.getElementById('home').style.color = '#fff';
    document.getElementById('auth').style.textDecoration = 'unset';
    document.getElementById('auth').style.color = '#fff';
    document.getElementById('about').style.textDecoration = 'underline';
    document.getElementById('about').style.color = '#1da7e7';
    document.getElementById('predict').style.textDecoration = 'unset';
    document.getElementById('predict').style.color = '#fff';
  }
}
