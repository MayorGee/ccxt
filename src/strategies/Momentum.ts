import { OrderSide } from '../abstract/enum.js';
import { IStrategy } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import Telegram from '../models/Telegram.js';

export default class Momentum implements IStrategy {
    private telegram: Telegram;
    private binance: Binance;
    private symbol = 'BTC/USDT';
    private orderSize = 0.01;
    private momentumThreshold = 0.02;
    private momentum = 0;

    constructor(
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }
    
    public initTelegram() {
        this.telegram.setOnText(/\/findMomentumOppurtunity/, this.findMomentumOppurtunity.bind(this));
    }

    private async findMomentumOppurtunity() {
        const previousTicker = await this.binance.fetchTicker(this.symbol);
        let previousPrice = previousTicker.close;

        while (true) {
            const ticker = await this.binance.fetchTicker(this.symbol);
            const currentPrice = ticker.close;

            if (!currentPrice || !previousPrice) {
                console.log('There was an error fetching currentPrice or previous Price');
                return;
            } 
            
            this.momentum = this.calculateMomentum(currentPrice, previousPrice);

            // Check if the momentum exceeds the threshold
            const momentumExceedThreshold = (Math.abs(this.momentum) > this.momentumThreshold) && (this.momentum > 0);
            
            momentumExceedThreshold ? 
            this.executeMarketOrder(OrderSide.buy) :
            this.executeMarketOrder(OrderSide.sell);

            previousPrice = currentPrice;

            // Wait for a certain interval before checking again
            await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust the interval as needed
        }
    }

    private calculateMomentum(currentPrice: number, previousPrice: number): number {
        return (currentPrice - previousPrice) / previousPrice;
    }

    private async executeMarketOrder(side: string) {
        switch (side) {
            case OrderSide.buy:
                await this.binance.createMarketOrder(this.symbol, OrderSide.buy, this.orderSize);
            case OrderSide.sell:
                await this.binance.createMarketOrder(this.symbol, OrderSide.sell, this.orderSize);
            default:
                console.log('ERROR: Market order can only be of type buy or sell');
        }
    }

}