export default class PredictPage {
  async render() {
    return `
      <section class="container">
        <h1>Predict Page</h1>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById('home').style.textDecoration = 'unset';
    document.getElementById('home').style.color = '#fff';
    document.getElementById('auth').style.textDecoration = 'unset';
    document.getElementById('auth').style.color = '#fff';
    document.getElementById('about').style.textDecoration = 'unset';
    document.getElementById('about').style.color = '#fff';
    document.getElementById('predict').style.textDecoration = 'underline';
    document.getElementById('predict').style.color = '#1da7e7';
  }
}
