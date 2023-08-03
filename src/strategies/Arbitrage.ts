import ccxt, { OrderBook } from 'ccxt';
import { IStrategy } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import Telegram from '../models/Telegram.js';
import { exchangesForArbitrage } from '../store/ExchangesForArbitrage.js';

export default class Arbitrage implements IStrategy {
    private telegram: Telegram;
    private binance: Binance;
    private symbol = 'BTC/USDT';

    constructor(
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public initTelegram() {
        this.telegram.setOnText(/\/checkArbitrageOpportunity/, this.checkArbitrageOpportunity.bind(this));
    }

    private async checkArbitrageOpportunity() {
        this.telegram.sendMessage({
            message: `Starting your search...`
        }); 

        const binanceOrderBook = await this.binance.fetchOrderBook(this.symbol);
        const [binanceBidPrice, binanceAskPrice] = this.getOrderBookPrices(binanceOrderBook);
                   
        for(const exchangeName of exchangesForArbitrage) {
            try {
                const exchange = new (ccxt as any)[exchangeName]();
                const exchangeOrderBook = await exchange.fetchOrderBook(this.symbol);
            
                if (this.isFaultyExchange(exchangeOrderBook) || this.isFaultyExchange(binanceOrderBook)) {
                   continue;
                }
            
                const [exchangeBidPrice, exchangeAskPrice] = this.getOrderBookPrices(exchangeOrderBook); // Highest bid price
                                
                const longPercentageGain = this.calculatePercentageGain(exchangeAskPrice, binanceBidPrice);
                const shortPercentageGain = this.calculatePercentageGain(binanceAskPrice, exchangeBidPrice);

                this.telegram.sendMessage({
                    message: `EXCHANGE: ${exchangeName} \n\nLONG Profit ===> ${longPercentageGain}% \nSHORT Profit ===> ${shortPercentageGain}%\n`
                });  
            } catch (error: any) {
                console.error(`Error fetching data from ${exchangeName}:`, error.message);
            }
        }        
    }

    private isFaultyExchange(orderBook: OrderBook): Boolean {
        return !orderBook || !orderBook?.bids || !orderBook?.asks;
    }

    private calculatePercentageGain(askPrice: number, bidPrice: number) {
        const gain = ((askPrice - bidPrice) * 100) / bidPrice;
        
        return Math.round(gain * 100) / 100;
    }

    private getAsksBidsFromOrderBook(orderBook: OrderBook) {
        return [orderBook.bids[0][0], orderBook.asks[0][0]];
    }

    private getOrderBookPrices(orderBook: OrderBook) {
        const [bidPrice, askPrice] = this.getAsksBidsFromOrderBook(orderBook);

        return [bidPrice, askPrice];
    }

    /*
        ======== CODE TO TRANSFER COIN TO ANOTHER EXCHANGE ======

            const firstExchange = new ccxt.Binance();
            const secondExchange = new ccxt.Kraken();

            const coin = "BTC";
            const amount = 1;

            const firstPrice = firstExchange.fetchMarketPrice(coin);
            const secondPrice = secondExchange.fetchMarketPrice(coin);

            const amountToTransfer = Math.round((amount * secondPrice) / firstPrice);

            firstExchange.transfer(coin, amountToTransfer, secondExchange.id);

            secondExchange.createMarketOrder(coin, "sell", amountToTransfer);                 
                    
    */
}