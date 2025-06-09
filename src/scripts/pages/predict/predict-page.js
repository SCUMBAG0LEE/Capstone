export default class PredictPage {
  async render() {
    if (!localStorage.getItem('token')) { window.location.href = "#/auth"; return ''; }
    return `
      <div class="home-container">
        <div class="predict-main">
          <div class="predict-chart-panel">
            <select id="intervalSelect" class="predict-input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="decade">Decade</option>
            </select>
            <h3 id="chartTitle" style="color: #222; text-align: center; margin-bottom: 10px;">Loading Chart...</h3>
            <canvas id="stockChart" width="800" height="300"></canvas>
          </div>
          <div class="predict-input-panel">
            <select id="symbolSelect" class="predict-input"></select>
            <input class="predict-input" type="number" placeholder="Amount Owned (optional)" id="amountInput" />
            <input class="predict-input" type="number" placeholder="Purchase Price (optional)" id="priceInput" />
            <input class="predict-input" type="text" placeholder="Prediction Timeframe*" id="timeframeInput" />
            <button class="home-btn" id="adviceBtn">
              📈 Advice
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Highlight nav link
    ['home', 'auth', 'about', 'predict'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.textDecoration = id === 'predict' ? 'underline' : 'unset';
        el.style.color = id === 'predict' ? '#1da7e7' : '#fff';
      }
    });

    const API_KEY = 'R7K13FGHUZMLHYGR';
    const sp500 = await fetch('sp500.json').then(res => res.json());

    const symbolSelect = document.getElementById('symbolSelect');
    const intervalSelect = document.getElementById('intervalSelect');
    const chartTitle = document.getElementById('chartTitle');
    const ctx = document.getElementById('stockChart').getContext('2d');
    let chart;

    // Populate symbol dropdown
    sp500.forEach(stock => {
      const opt = document.createElement('option');
      opt.value = stock.Symbol;
      opt.textContent = `${stock.Symbol} - ${stock.Name}`;
      symbolSelect.appendChild(opt);
    });

    async function fetchAndRenderChart() {
      const symbol = symbolSelect.value;
      const interval = intervalSelect.value;
      chartTitle.textContent = `${symbol} Stock Chart`;

      let functionType = 'TIME_SERIES_DAILY';
      if (interval === 'weekly') functionType = 'TIME_SERIES_WEEKLY';
      if (interval === 'monthly') functionType = 'TIME_SERIES_MONTHLY';

      const res = await fetch(`https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`);
      const data = await res.json();

      let timeSeries = data['Time Series (Daily)'] || data['Weekly Time Series'] || data['Monthly Time Series'];
      if (!timeSeries) return;

      let chartData = Object.entries(timeSeries).slice(0, 100).reverse().map(([date, val]) => ({
        x: date,
        y: parseFloat(val['4. close'])
      }));

      if (interval === 'yearly' || interval === 'decade') {
        const yearly = {};
        chartData.forEach(d => {
          const year = d.x.slice(0, 4);
          (yearly[year] ||= []).push(d.y);
        });
        chartData = Object.entries(yearly).map(([year, closes]) => ({
          x: interval === 'decade' ? `${year.slice(0, 3)}0s` : year,
          y: closes.reduce((a, b) => a + b, 0) / closes.length
        }));
      }

      if (chart) chart.destroy();

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.map(d => d.x),
          datasets: [{
            label: `${symbol} Close Price`,
            data: chartData.map(d => d.y),
            borderColor: '#1da7e7',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { ticks: { font: { size: 10 } } },
            y: { beginAtZero: false }
          }
        }
      });
    }

    symbolSelect.addEventListener('change', fetchAndRenderChart);
    intervalSelect.addEventListener('change', fetchAndRenderChart);

    fetchAndRenderChart();
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
