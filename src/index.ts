import Binance from './Binance.js';
import Telegram from './Telegram.js';

const binance = new Binance();
const telegram = new Telegram();

binance.initTrade();
telegram.initBot();
