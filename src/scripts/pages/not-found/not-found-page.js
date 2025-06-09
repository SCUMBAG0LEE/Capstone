export default class NotFoundPage {
  async render() {
    return `
      <div class="home-container" style=" min-height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center">
          <h1 style="position: fixed; color: #fff; font-size: 48px; margin-bottom: 24px; top: 25%;">Not Found</h1>
          <img src="/Images/notfound.gif" alt="Not Found" style="position: fixed; top: 35%; max-width: 400px; width: 100%; border-radius: 16px; box-shadow: 0 0 24px #0004;"/>
        </div>
      </div>
      `;
  }

  async afterRender() {
    document.getElementById('home').style.textDecoration = 'unset';
    document.getElementById('home').style.color = '#fff';
    document.getElementById('auth').style.textDecoration = 'unset';
    document.getElementById('auth').style.color = '#fff';
    document.getElementById('about').style.textDecoration = 'unset';
    document.getElementById('about').style.color = '#fff';
    document.getElementById('predict').style.textDecoration = 'unset';
    document.getElementById('predict').style.color = '#fff';
  }
}
