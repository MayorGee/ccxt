import ccxt, { OrderBook } from 'ccxt';
import { IStrategy } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import Telegram from '../models/Telegram.js';

export default class Arbitrage implements IStrategy {
    private telegram: Telegram;
    private binance: Binance;
    private symbol = 'BTC/USDT';
    private exchange1 = 'Binance';
    private exchange2 = 'ByBit';

    constructor(
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public initTelegram() {
        this.telegram.setOnText(/\/findExchangesWithGreatestPriceDifference/, this.findExchangeWithGreatestPriceDifference.bind(this));
        this.telegram.setOnText(/\/findArbitrageOppurtunity/, this.findArbitrageOppurtunity.bind(this));
    }

    private async findExchangeWithGreatestPriceDifference() {
        try {
            const exchanges = ccxt.exchanges;
        
            let maxSpread = 0;
            let exchangeWithMaxSpread: string | null = null;
            let secondExchangeWithMaxSpread: string | null = null;

            this.telegram.sendMessage({
                message: `Starting your search, This may take some time so sit tight baby`
            }); 
        
            exchanges.forEach(async (exchangeName) => {
                try {
                    const exchange = new (ccxt as any)[exchangeName]();
                    const orderBook: OrderBook = await exchange.fetchOrderBook(this.symbol);
            
                    if (!orderBook || !orderBook.bids || !orderBook.asks) {
                       return;
                    }
            
                    const bidPrice = orderBook.bids[0][0]; // Highest bid price
                    const askPrice = orderBook.asks[0][0]; // Lowest ask price
            
                    const spread = askPrice - bidPrice;
            
                    if (spread > maxSpread) {
                        maxSpread = spread;
                        secondExchangeWithMaxSpread = exchangeWithMaxSpread;
                        exchangeWithMaxSpread = exchangeName;
                    }

                } catch (error: any) {
                    console.error(`Error fetching data from ${exchangeName}:`, error.message);
                }
            }); 

            this.telegram.sendMessage({
                message: `Exchange 1: ${exchangeWithMaxSpread}, spread: ${maxSpread} \n Exchange 2: ${secondExchangeWithMaxSpread}, spread: ${maxSpread}`
            });        
        } catch(error: any) {
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            }); 
        }
    }

    private async findArbitrageOppurtunity() {
        try {
            const profit1 = this.calculateArbitrageProfit(this.exchange1);
            const profit2 = this.calculateArbitrageProfit(this.exchange2);
        
            this.telegram.sendMessage({
                message: `Buying ${this.symbol}... \non ${this.exchange2} and selling on ${this.exchange1} will give ${profit1} \non ${this.exchange1} and selling on ${this.exchange2} will give ${profit2}`
            });
        } catch (error: any) {
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            });
        }
    }

    private async calculateArbitrageProfit(exchange: string) {
        const exchangeInstance = new (ccxt as any)[exchange]();
        const orderBook = await exchangeInstance.fetchOrderBook(this.symbol);
                    
        const exchangeBid = orderBook.bids[0][0];
        const exchangeAsk = orderBook.asks[0][0];
        
        const profit = this.calculateArbitragePercentageProfit(exchangeAsk, exchangeBid);

        return profit;
    }

    private calculateArbitragePercentageProfit(askPrice: number, bidPrice: number) {
        const profitPercentage = ((bidPrice - askPrice) / askPrice) * 100;
        return profitPercentage.toFixed(2);
    }
}