import Binance from './Binance.js';
import { Order } from 'ccxt';
import Position from './Position.js';
import Base from './Base.js';

export default class OrderModel extends Binance {
    static async createLimitBuy() {
        const buyVolume = await Base.getBuyVolume();

        Position.buy.forEach(async (buyPosition) => {
            // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPosition);
            console.log(`Created Limit Buy Order at ${buyPosition} for ${buyVolume} on ${this.market}`);
        });
    }

    static async createLimitSell() {
        const sellVolume = await Base.getSellVolume();

        Position.sell.forEach(async (sellPosition) => {
            // await this.client.createLimitSellOrder(this.market, sellVolume, sellPrice);
            console.log(`Created Limit Sell Order at ${sellPosition} for ${sellVolume} on ${this.market}`);
        });
    }

    static async cancelAll(): Promise<void> {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach((order: Order) => {
            this.client.cancelOrder(order.id);
        });
    }

}