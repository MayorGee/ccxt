import { Order, binance } from 'ccxt';

import { binanceClient } from '../config/binanceClient.js';
import Exchange from './Exchange.js';
import { OrderSide } from '../abstract/enum.js';

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

    public fetchOrderBook(symbol: string) {
        return this.client.OrderBook(symbol);
    }

    public async createLimitBuyOrder(symbol: string, orderSize: number, bidPrice: number) {
        
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

    public async createLimitSellOrder(symbol: string, orderSize: number, bidPrice: number) {
        
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

    public async createMarketOrder(symbol: string, orderSide: 'buy' | 'sell' , orderSize: number) {
        this.client.createMarketOrder(symbol, orderSide, orderSize);
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