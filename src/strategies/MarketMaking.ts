import { IStrategy } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import Telegram from '../models/Telegram.js';

export default class MarketMakingStrategy implements IStrategy {
    private bidSpread = 10;
    private askSpread = 10;

    private orderSize = 0.01;

    private symbol = 'DOT/USDT';
    private telegram: Telegram;
    private binance: Binance;
    
    constructor (
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public async initTelegram () {      
        this.telegram.setOnText(/\/makeMarket/, this.makeMarket.bind(this));
    }

    private async makeMarket() {
        try {        
            while (true) {
                const orderBook = await this.binance.fetchOrderBook(this.symbol);
        
                // Get the highest bid and lowest ask prices from the order book
                const bidPrice = orderBook.bids[0][0];
                const askPrice = orderBook.asks[0][0];
        
                // Calculate bid and ask prices with spreads
                const adjustedBidPrice = bidPrice - this.bidSpread;
                const adjustedAskPrice = askPrice + this.askSpread;
        
                // Place limit orders on both sides of the order book
                // await this.binance.createLimitBuyOrder(this.symbol, this.orderSize, adjustedBidPrice);
                // await this.binance.createLimitSellOrder(this.symbol, this.orderSize, adjustedAskPrice);
                        
                this.telegram.sendMessage({
                    message: `Placed buy order at: ${adjustedBidPrice}`
                });
                
                this.telegram.sendMessage({
                    message: `Placed sell order at: ${adjustedAskPrice}`
                });
        
                // Wait for a certain interval before placing the next set of orders
                await this.sleep(5000); // Adjust the interval as needed
            }
        } catch (error: any) {
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            });
        }
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}