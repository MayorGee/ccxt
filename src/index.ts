import Binance from './model/Binance.js';
import Telegram from './model/Telegram.js';

const telegram = new Telegram();

Binance.initTrade();
telegram.initBot();