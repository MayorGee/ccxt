import axios from 'axios';

import { Balance, Balances, Order } from 'ccxt';
import { config } from '../config/config.js';

export default class Exchange {
    public client: any;
    public tickInterval = Number(config.tickInterval);
    public assetTicker = config.assetTicker;
    public baseTicker = config.baseTicker;
    public assetName = config.assetName;
    public baseName = config.baseName;
    public stopLoss = config.stopLoss;
    public allocation = Number(config.allocation);
    public tradePositionRange = Number(config.tradePositionRange);
    public market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;

    public async createOrders() {}
    public async createLimitBuyOrders() {}
    public async createLimitSellOrders() {}

    public async getMarketPrice(): Promise<number> {
        const averagePrices = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.assetName}&vs_currencies=usd`),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.baseName}&vs_currencies=usd`)
        ]);
    
        return averagePrices[0].data[this.assetName].usd / averagePrices[1].data[this.baseName].usd;
    }

    public async cancelAllOrders(): Promise<void> {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach((order: Order) => {
            this.client.cancelOrder(order.id);
        });
    }

    public async getAssetBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.assetTicker];
    }

    public async getBaseBalance(): Promise<Balance> {
        const balances: Balances = await this.client.fetchBalance();

        return balances[this.baseTicker];
    }

    public async getSellVolume(): Promise<any> {}
    public async getBuyVolume(): Promise<any> {}

    public async initTrade() {
        // await this.createOrders(); 

        // setInterval(
        //     this.createOrders, 
        //     this.tickInterval
        // );
    }
}