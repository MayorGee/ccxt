import Binance from './Binance.js';
import { Balance, Balances } from 'ccxt';
import { config } from '../config/config.js';
import Position from './Position.js';

export default class Base extends Binance {
    static ticker = config.baseTicker;
    static title = config.baseName;

    static async getBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.ticker];
    }

    static async getSellVolume(): Promise<number> {
        const assetBalance = await this.getBalance();

        return assetBalance.free * this.allocation;
    }

    static async getBuyVolume(): Promise<number> {
        const baseBalance = await this.getBalance();
        const marketPrice = await this.getMarketPrice();
        const buyVolume = ((baseBalance.free * this.allocation) / marketPrice) / Position.tradePositionRange;

        return buyVolume;
    }
}