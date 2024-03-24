import  { binance } from 'ccxt';

import { binanceClient } from '../config/binanceClient.js';
import Exchange from './Exchange.js';

export default class Binance extends Exchange {
    public client: binance = binanceClient;
    
    public fetchTicker(symbol: string) {
        return this.client.fetchTicker(symbol);
    }

    public fetchOrderBook(symbol: string) {
        return this.client.fetchOrderBook(symbol);
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

    public async createOrder(market: string, orderType: string, orderSide: string, orderSize: number, price: number, params = {}) {
        
        // set Initial Order
        // this.client.createOrder(market, orderType, orderSide, orderSize, price);

        // set StopLoss
        // exchange.create_order(symbol, 'market', 'sell', amount, None, {'stopPrice': stopLossPrice})
        // this.client.createOrder(market, orderType, orderSide, None, stopLossPrice);

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
}