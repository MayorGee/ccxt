import Binance from './Binance.js';
import Telegram from './Telegram.js';

const telegram = new Telegram();

Binance.initTrade();
telegram.initBot();