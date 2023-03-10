import axios from 'axios';

import { config } from './config/config.js';
import { binanceClient } from './config/binanceClient.js';
import { Balance, Balances, binance } from 'ccxt';

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
   
        const marketPrice = await this.getMarketPrice();
    
        const sellPrice = await this.getSellPrice();
        const buyPrice = await this.getBuyPrice();
        
        const [ assetBalance, baseBalance ] = await this.getBalances();

        // console.log(`
        //     FREE BALANCES:
        //     Asset Balance -  ${assetBalance.free}
        //     Base Balance -  ${baseBalance.free}
        // `)

        const [ sellVolume, buyVolume ] = await this.getVolumes();
    
        // await this.client.createLimitSellOrder(this.market, sellVolume, sellPrice);
        // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPrice);
     
        // console.log(`
        //     New tick for ${this.market}...
        //     Created limit sell order for ${sellVolume} at ${sellPrice}
        //     Created limit buy order for ${buyVolume} at ${buyPrice}
        // `)
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

    static async createBuyOrders() {
        const [sellVolume, buyVolume] = await this.getVolumes();

        this.buyPositions.forEach(async (buyPosition) => {
            // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPosition);
            console.log(`Created Limit Buy Order at ${buyPosition} for ${buyVolume} on ${this.market}`);
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

    static async getBalances(): Promise<Balance[]> {
        const balances: Balances = await this.client.fetchBalance();

        const assetBalance = balances[this.assetTicker];
        const baseBalance = balances[this.baseTicker];

        return [assetBalance, baseBalance];
    }

    static async getVolumes(): Promise<number[]> {
        const [ assetBalance, baseBalance ] = await this.getBalances();
        const marketPrice = await this.getMarketPrice();

        const sellVolume = assetBalance.free * this.allocation;
        const buyVolume = ((baseBalance.free * this.allocation) / marketPrice) / this.tradePositionRange;
        // volume divided by tradePosition (5)

        return [sellVolume, buyVolume];
    }

    static setBuyPositions(buyPositions: number[]) {
        this.buyPositions = buyPositions;
    }

    static setSellPositions(sellPositions: number[]) {
        this.sellPositions = sellPositions;
    }

    static async cancelAllOrders(): Promise<void> {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach(order => {
            this.client.cancelOrder(order.id);
        });
    }

    static async initTrade() {
        await this.createOrders();

        // setInterval(
        //     this.createOrders, 
        //     this.tickInterval
        // );
    }
}