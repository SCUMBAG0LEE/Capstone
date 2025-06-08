import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import './app.css';
import sp500 from '../data/sp500.json';

const API_KEY = 'R7K13FGHUZMLHYGR';

const TIMEFRAME_OPTIONS = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" }
];

const Predict = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [symbol, setSymbol] = useState(sp500[0].Symbol);
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [interval, setInterval] = useState('daily'); // new state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let functionType = "TIME_SERIES_DAILY";
                if (interval === "weekly") functionType = "TIME_SERIES_WEEKLY";
                if (interval === "monthly") functionType = "TIME_SERIES_MONTHLY";
                // For yearly/decade, you can aggregate monthly data in JS

                const res = await axios.get(
                    `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`
                );
                let timeSeries = res.data['Time Series (Daily)'];
                if (interval === "weekly") timeSeries = res.data['Weekly Time Series'];
                if (interval === "monthly") timeSeries = res.data['Monthly Time Series'];

                if (timeSeries) {
                    let chartData = Object.entries(timeSeries)
                        .slice(0, 100)
                        .reverse()
                        .map(([date, values]) => ({
                            date,
                            close: parseFloat(values['4. close'])
                        }));

                    // Aggregate for yearly/decade if needed
                    if (interval === "yearly" || interval === "decade") {
                        // Group by year
                        const yearly = {};
                        chartData.forEach(d => {
                            const year = d.date.slice(0, 4);
                            if (!yearly[year]) yearly[year] = [];
                            yearly[year].push(d.close);
                        });
                        chartData = Object.entries(yearly).map(([year, closes]) => ({
                            date: year,
                            close: closes.reduce((a, b) => a + b, 0) / closes.length
                        }));
                        if (interval === "decade") {
                            // Group by decade
                            const decadeMap = {};
                            chartData.forEach(d => {
                                const decade = d.date.slice(0, 3) + "0s";
                                if (!decadeMap[decade]) decadeMap[decade] = [];
                                decadeMap[decade].push(d.close);
                            });
                            chartData = Object.entries(decadeMap).map(([decade, closes]) => ({
                                date: decade,
                                close: closes.reduce((a, b) => a + b, 0) / closes.length
                            }));
                        }
                    }

                    setData(chartData);
                } else {
                    setData([]);
                }
            } catch (e) {
                setData([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [symbol, interval]);

    return (
        <div className="home-container">
            <nav className="home-nav">
                <div>{/* Logo here */}</div>
                <div className="home-nav-links">
                    <Link to="/" className="home-nav-link">Home</Link>
                    <Link to="/predict" className="home-nav-link">Predict</Link>
                    <Link to="/about" className="home-nav-link">About</Link>
                    <Link to="/login" className="home-nav-link">Login</Link>
                </div>
            </nav>
            <div className="predict-main">
                <div className="predict-chart-panel">
                    <select
                        value={interval}
                        onChange={e => setInterval(e.target.value)}
                        className="predict-input"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="decade">Decade</option>
                    </select>
                    <h3 style={{ color: '#222', textAlign: 'center', marginBottom: 10 }}>{symbol} Stock Chart</h3>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="close" stroke="#1da7e7" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="predict-input-panel">
                    <select
                        value={symbol}
                        onChange={e => setSymbol(e.target.value)}
                        className="predict-input"
                    >
                        {sp500.map(stock => (
                            <option key={stock.Symbol} value={stock.Symbol}>
                                {stock.Symbol} - {stock.Name}
                            </option>
                        ))}
                    </select>
                    <input
                        className="predict-input"
                        type="number"
                        placeholder="Amount Owned (optional)"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <input
                        className="predict-input"
                        type="number"
                        placeholder="Purchase Price (optional)"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                    <input
                        className="predict-input"
                        type="text"
                        placeholder="Prediction Timeframe*"
                        value={timeframe}
                        onChange={e => setTimeframe(e.target.value)}
                    />
                    <button className="home-btn">
                        <span role="img" aria-label="advice">📈</span> Advice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Predict;