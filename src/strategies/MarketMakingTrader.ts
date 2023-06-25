import Trader from '../models/Trader.js';
import { IStrategy } from '../abstract/interfaces.js';

export default class MarketMakingTrader extends Trader implements IStrategy {
    static spread: number;

    public async execute () {      
        setInterval(async () => {
            try {
                const ticker = await this.binance.fetchTicker(this.symbol);
                const { bid, ask } = this.calculateBidAsk(ticker);
            
                // Place buy and sell orders at the bid and ask prices
            
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }, 3000);
    }

    private calculateBidAsk(ticker: any): { bid: number, ask: number } {
        const { bid, ask } = ticker;
        const spreadAmount = (ask - bid) * MarketMakingTrader.spread;

        return { 
            bid: bid - spreadAmount, 
            ask: ask + spreadAmount 
        };
    }
}