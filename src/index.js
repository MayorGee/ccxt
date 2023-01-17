import CryptoBot from './CryptoBot.js';
import Telegram from './Telegram.js';

const cryptoBot = new CryptoBot();
const telegram = new Telegram();

// cryptoBot.initTrade();
telegram.initBot();