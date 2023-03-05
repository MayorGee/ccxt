import axios from 'axios';

import { config } from './config/config.js';
import { binanceClient } from './config/binanceClient.js';
import { Balance, Balances, binance } from 'ccxt';

export default class Binance {
    private client: binance;
    private tickInterval: string;
    private assetTicker: string;
    private baseTicker: string;
    private assetName: string;
    private baseName: string;
    private spread: string;
    private allocation: string;
    private market: string;
    
    constructor () {
        this.tickInterval = config.tickInterval;
        this.client = binanceClient;
        // this.client.verbose = true;

        this.assetTicker = config.assetTicker;
        this.baseTicker = config.baseTicker;

        this.assetName = config.assetName;
        this.baseName = config.baseName;

        this.spread = config.spread;
        this.allocation = config.allocation;
        this.market = `${this.assetTicker}/${this.baseTicker}`;  // BTC/USDT
    }
    
    async createOrders() {
        await this.cancelAllOrders();
   
        const marketPrice = await this.getMarketPrice();
    
        const sellPrice = await this.getSellPrice();
        const buyPrice = await this.getBuyPrice();
        
        const [ assetBalance, baseBalance ] = await this.getBalances();

        console.log(`
            Free Balances:
                Asset Balance -  ${assetBalance.free}
                Base Balance -  ${baseBalance.free}
        `)

        const [ sellVolume, buyVolume ] = this.getVolumes(assetBalance, baseBalance, marketPrice);
    
        // await this.client.createLimitSellOrder(this.market, sellVolume, sellPrice);
        // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPrice);
     
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
        const sellPrice = marketPrice * (1 + Number(this.spread));

        return sellPrice;
    }

    async getBuyPrice() {
        const marketPrice = await this.getMarketPrice();
        const buyPrice = marketPrice * (1 - Number(this.spread));

        return buyPrice;
    }

    async getBalances() {
        const balances: Balances = await this.client.fetchBalance();

        const assetBalance = balances[this.assetTicker];
        const baseBalance = balances[this.baseTicker];

        console.log('Asset -', assetBalance)
        console.log('Base -', baseBalance)

        return [assetBalance, baseBalance];
    }

    getVolumes(assetBalance: Balance, baseBalance: Balance, marketPrice: number) {
        const sellVolume = assetBalance.free * Number(this.allocation);
        const buyVolume = (baseBalance.free * Number(this.allocation)) / marketPrice;

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

        // setInterval(
        //     this.createOrders, 
        //     Number(this.tickInterval)
        // );
    }
}