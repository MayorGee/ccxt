import axios from 'axios';

import { config } from '../config/config.js';

export default class Exchange {
    public client: any;
    public tickInterval = Number(config.tickInterval);
    public assetTicker = config.assetTicker;
    public baseTicker = config.baseTicker;
    public assetName = config.assetName;
    public baseName = config.baseName;
    public stopLoss = Number(config.stopLoss);
    public takeProfit = Number(config.stopLoss);
    public allocation = Number(config.allocation);
    public tradePositionRange = Number(config.tradePositionRange);
    public market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;

    public async getMarketPrice(): Promise<number> {
        const averagePrices = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.assetName}&vs_currencies=usd`),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.baseName}&vs_currencies=usd`)
        ]);
    
        return averagePrices[0].data[this.assetName].usd / averagePrices[1].data[this.baseName].usd;
    }
 
    protected getStopLossPrice(limitBuyPrice: number) {
        return limitBuyPrice - this.stopLoss
    }

    protected getTakeProfitPrice(limitBuyPrice: number) {
        return limitBuyPrice + this.stopLoss
    }
}