import axios from 'axios';

import { config } from './config/config.js';
import { binanceClient } from './config/binanceClient.js';

export default class CryptoBot {
    constructor () {
        this.config = config;
        this.client = binanceClient;

        this.assetTicker = config.assetTicker;
        this.baseTicker = config.baseTicker;

        this.assetName = config.assetName;
        this.baseName = config.baseName;

        this.spread = config.spread;
        this.allocation = config.allocation;
        this.market = `${config.asset}/${config.base}`;  // BTC/USDT
    }

    async createOrders() {
        await this.cancelAllOrders();
   
        const marketPrice = await this.getMarketPrice();
    
        const sellPrice = this.getSellPrice();
        const buyPrice = this.getBuyPrice();
        
        const [ assetBalance, baseBalance ] = await this.getBalances();
        const [ sellVolume, buyVolume ] = this.getVolumes(assetBalance, baseBalance, marketPrice);
    
        await this.client.createLimitSellOrder(this.market, sellVolume, sellPrice);
        await this.client.createLimitBuyOrder(this.market, buyVolume, buyPrice);
     
        console.log(`
            New tick for ${this.market}...
            Created limit sell order for ${sellVolume} at ${sellPrice}
            Created limit buy order for ${buyVolume} at ${buyPrice}
        `)
    }

    async getMarketPrice() {
        const averagePrices = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.assetName}&vs_currencies=usd`),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.baseName}&vs_currencies=usd`)
        ]);
    
        return averagePrices[0].data[this.assetName].usd / averagePrices[1].data[this.baseName].usd;
    }

    async getSellPrice() {
        const marketPrice = await this.getMarketPrice();
        const sellPrice = marketPrice * (1 + this.spread);

        return sellPrice;
    }

    async getBuyPrice() {
        const marketPrice = await this.getMarketPrice();
        const buyPrice = marketPrice * (1 - this.spread);

        return buyPrice;
    }

    async getBalances() {
        const balances = await this.client.fetchBalance();

        const assetBalance = balances.free[this.assetTicker];
        const baseBalance = balances.free[this.baseTicker];

        return [assetBalance, baseBalance];
    }

    getVolumes(assetBalance, baseBalance, marketPrice) {
        const sellVolume = assetBalance * this.allocation;
        const buyVolume = (baseBalance * this.allocation) / marketPrice;

        return [sellVolume, buyVolume];
    }

    async cancelAllOrders() {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach(order => {
            this.client.cancelOrder(order.id);
        });
    }

    async initTrade() {
        await this.createOrders();

        setInterval(
            this.createOrders, 
            this.config.tickInterval
        );
    }
}