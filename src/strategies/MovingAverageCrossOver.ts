import { IStrategy, Ohlcv } from '../abstract/interfaces.js';
import { OrderSide } from '../abstract/enum.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

export default class MovingAverageCrossOver implements IStrategy {
    private shortMovingAverage = 20;
    private longMovingAverage = 50;
    private position = OrderSide.hold;
    private telegram: Telegram;
    
    constructor(telegram: Telegram) {
        this.telegram = telegram;
    }

    public initTelegram() {
        this.telegram.setOnText(/\/findMovingAverageEntry/, this.findMovingAverageEntry.bind(this));
    }    

    private async findMovingAverageEntry() {
        this.telegram.sendMessage({
            message: 'Searching For Moving Average Entry Points...'
        });

        setInterval(async () => {
            await this.triggerOrderSignal();
        }, 2000);
    }

    private async triggerOrderSignal() {
        const candles = await OhlcvModel.getData() as Ohlcv[];
        const closePrices = candles.map((candle) => candle.close);

        const shortAverage = this.calculateMovingAverage(closePrices, this.shortMovingAverage);
        const longAverage = this.calculateMovingAverage(closePrices, this.longMovingAverage);

        // generate buy/sell signals based on averages
        this.determineOrderSide(shortAverage, longAverage);
    }

    private determineOrderSide(shortAverage: number, longAverage: number) {
        if (shortAverage > longAverage && this.position !== OrderSide.buy) {
            this.position = OrderSide.buy;

            this.telegram.sendMessage({
                message: `Buy signal triggered at ${longAverage}`
            });
        } else if (shortAverage < longAverage && this.position !== OrderSide.sell) {
            this.position = OrderSide.sell;

            this.telegram.sendMessage({
                message: `Sell signal triggered at ${shortAverage}`
            });
        } else {
            this.position = OrderSide.hold;
        }
    }

    private calculateMovingAverage(closePrices: number[], period: number): number {
        const lastPeriodPrices = closePrices.slice(-period);
        const sum = lastPeriodPrices.reduce((total, price) => total + price, 0);

        return sum / period;
    }
}