import { Order, binance } from 'ccxt';

import { binanceClient } from '../config/binanceClient.js';
import Exchange from './Exchange.js';

export default class Binance extends Exchange {
    public client: binance = binanceClient;
    
    public async cancelAllOrders(): Promise<void> {
        const orders = await this.client.fetchOpenOrders(this.market);

        orders.forEach((order: Order) => {
            this.client.cancelOrder(order.id);
        });
    }

    public fetchTicker(symbol: string) {
        return this.client.fetchTicker(symbol);
    }

    public async createLimitBuyOrder(limitBuyPrice: number) {
        const buyVolume = await this.getBuyVolume();
        const stopLossPrice = this.getStopLossPrice(limitBuyPrice);
        const takeProfitPrice = this.getTakeProfitPrice(limitBuyPrice);
        
        // set Initial Order
        // exchange.create_order(symbol, 'limit', 'buy', amount, price)
        // this.client.createOrder(this.market, OrderType.limit, OrderSide.buy, buyVolume, limitBuyPrice);

        // set StopLoss
        // exchange.create_order(symbol, 'market', 'sell', amount, None, {'stopPrice': stopLossPrice})
        // this.client.createOrder(this.market, OrderType.market, OrderSide.sell, buyVolume, stopLossPrice);

        // set TakeProfit
        // exchange.create_order(symbol, 'market', 'sell', amount, None, {'stopPrice': stopLossPrice})
        // this.client.createOrder(this.market, OrderType.market, OrderSide.sell, buyVolume, takeProfitPrice);
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
}