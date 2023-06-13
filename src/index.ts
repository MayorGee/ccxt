import MovingAverageTrader from './models/MovingAverageTrader.js';
// import SwingTrader from './models/SwingTrader.js';

const movingAverageTrader = new MovingAverageTrader();
movingAverageTrader.initTelegram();

// const swingTrader = new SwingTrader();
// swingTrader.prepareSwingExtremes();
// swingTrader.initTelegram();