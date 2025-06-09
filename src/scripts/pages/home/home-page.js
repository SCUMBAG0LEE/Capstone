export default class HomePage {
  async render() {
    return `
       <div class="home-container">
            <div class="home-main">
                <div class="home-text">
                    <p class="home-subtitle">Your stock prediction genie</p>
                </div>
                <img src="Images/qq-1.png" alt="Genie" class="genie-art" />
                <img src="Images/hex-1.png" alt="Hex" class="hex-1" />
            </div>
            <div class="circle-1"></div>
        </div>
    `;
  }

  async afterRender() {
    document.getElementById('home').style.textDecoration = 'underline';
    document.getElementById('home').style.color = '#1da7e7';
    document.getElementById('auth').style.textDecoration = 'unset';
    document.getElementById('auth').style.color = '#fff';
    document.getElementById('about').style.textDecoration = 'unset';
    document.getElementById('about').style.color = '#fff';
    document.getElementById('predict').style.textDecoration = 'unset';
    document.getElementById('predict').style.color = '#fff';
    //const presenter = new HomePagePresenter(this);
    //await presenter.initialize();
  }
}
