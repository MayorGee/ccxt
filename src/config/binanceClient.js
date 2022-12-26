import ccxt from 'ccxt';
import Environment from '../Environment.js';

export const binanceClient = new ccxt.binance({
    apiKey: Environment.getApiKey(),
    secret: Environment.getApiSecretKey()
});