import axios from 'axios';

import { config } from './config/config.js';
import { binanceClient } from './config/binanceClient.js';
import { Balance, Balances, binance, Order } from 'ccxt';

export default class Binance {
    static client: binance = binanceClient;
    static tickInterval = Number(config.tickInterval);
    static assetTicker = config.assetTicker;
    static baseTicker = config.baseTicker;
    static assetName = config.assetName;
    static baseName = config.baseName;
    static stopLoss = config.stopLoss;
    static allocation = Number(config.allocation);
    static tradePositionRange = Number(config.tradePositionRange);
    static buyPositions: number[] = [] ;
    static sellPositions: number[] = [];
    static market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
    
    static async createOrders() {
        await this.cancelAllOrders();
        
        console.log('NOTHING HERE FAM, YOU MAY NEED TO COME CHECK THIS OUT DAWG!');
    }

    static prepareBuyPositions(lowerLimit: number, upperLimit: number) {
        const buyRange = (upperLimit - lowerLimit) / this.tradePositionRange;
        
        for(let i = 0; i < this.tradePositionRange; i++) {
            upperLimit = upperLimit - buyRange;
            this.buyPositions.push(upperLimit);
        }
    }

    static getBuyPositions(): number[] {
        return this.buyPositions;
    }

    static async createLimitBuyOrders() {
        const buyVolume = await this.getBuyVolume();

        this.buyPositions.forEach(async (buyPosition) => {
            // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPosition);
            console.log(`Created Limit Buy Order at ${buyPosition} for ${buyVolume} on ${this.market}`);
        });
    }

    static async createLimitSellOrders() {
        const sellVolume = await this.getSellVolume();

        this.sellPositions.forEach(async (sellPosition) => {
            // await this.client.createLimitSellOrder(this.market, sellVolume, sellPrice);
            console.log(`Created Limit Sell Order at ${sellPosition} for ${sellVolume} on ${this.market}`);
        });
    }

    static async getMarketPrice(): Promise<number> {
        const averagePrices = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.assetName}&vs_currencies=usd`),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.baseName}&vs_currencies=usd`)
        ]);
    
        return averagePrices[0].data[this.assetName].usd / averagePrices[1].data[this.baseName].usd;
    }

    static async getSellPrice(): Promise<number> {
        const marketPrice = await this.getMarketPrice();
        const sellPrice = marketPrice;

        return sellPrice;
    }

    static async getBuyPrice(): Promise<number> {
        const marketPrice = await this.getMarketPrice();
        const buyPrice = marketPrice;

        return buyPrice;
    }

    static async getAssetBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.assetTicker];
    }

    static async getBaseBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.baseTicker];
    }

    static async getSellVolume(): Promise<number> {
        const assetBalance = await this.getAssetBalance();

        return assetBalance.free * this.allocation;
    }

    static async getBuyVolume(): Promise<number> {
        const baseBalance = await this.getBaseBalance();
        const marketPrice = await this.getMarketPrice();
        const buyVolume = ((baseBalance.free * this.allocation) / marketPrice) / this.tradePositionRange;

        return buyVolume;
    }

    static setBuyPositions(buyPositions: number[]) {
        this.buyPositions = buyPositions;
    }

    static setSellPositions(sellPositions: number[]) {
        this.sellPositions = sellPositions;
    }

    static async cancelAllOrders(): Promise<void> {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach((order: Order) => {
            this.client.cancelOrder(order.id);
        });
    }

    static async initTrade() {
        // await this.createOrders(); 

        // setInterval(
        //     this.createOrders, 
        //     this.tickInterval
        // );
    }
}