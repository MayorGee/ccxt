import Binance from './Binance.js';
import { Balance, Balances } from 'ccxt';
import { config } from '../config/config.js';

export default class Asset extends Binance {
    static ticker = config.assetTicker;
    static title = config.assetName;

    static async getBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.ticker];
    } 
}