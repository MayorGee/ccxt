
import { binance } from 'ccxt';

import { binanceClient } from '../config/binanceClient.js';
import Exchange from './Exchange.js';
import { SwingLowHigh } from '../abstract/interfaces.js';

export default class Binance extends Exchange {
    public client: binance = binanceClient;
    public swingExtremes: SwingLowHigh[] = [];
    
    public async createOrders() {
        await this.cancelAllOrders();
        
        console.log('ALL ORDERS CANCELLED!');
    }

    public async createLimitBuyOrder() {
        const buyVolume = await this.getBuyVolume();
        // exchange.createLimitBuyOrder (symbol, amount, price, params)
        // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPosition);
    }

    public async getBuyVolume(): Promise<number> {
        const baseBalance = await this.getBaseBalance();
        const marketPrice = await this.getMarketPrice();
        const buyVolume = ((baseBalance.free * this.allocation) / marketPrice) / this.tradePositionRange;

        return buyVolume;
    }

    public async getSellVolume(): Promise<number> {
        const assetBalance = await this.getAssetBalance();

        return assetBalance.free * this.allocation;
    }

    public getSwingExtremes() {
        return this.swingExtremes;
    }

    public setSwingExtremes(swingExtremes: SwingLowHigh[]) {
        this.swingExtremes = swingExtremes;
    }
}