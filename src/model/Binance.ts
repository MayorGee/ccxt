import axios from 'axios';

import { binance } from 'ccxt';
import { config } from '../config/config.js';
import { binanceClient } from '../config/binanceClient.js';
import Base from './Base.js';
import Asset from './Asset.js';

export default class Binance {
    static client: binance = binanceClient;
    static tickInterval = Number(config.tickInterval);
    static stopLoss = config.stopLoss;
    static allocation = Number(config.allocation);
    static market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;

    static async getMarketPrice(): Promise<number> {
        const averagePrices = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${Asset.title}&vs_currencies=usd`),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${Base.title}&vs_currencies=usd`)
        ]);
    
        return averagePrices[0].data[Asset.title].usd / averagePrices[1].data[Base.title].usd;
    }

    static async initTrade() {
        // await this.createOrders(); 

        // setInterval(
        //     this.createOrders, 
        //     this.tickInterval
        // );
    }
}