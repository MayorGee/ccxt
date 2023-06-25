import Trader from '../models/Trader.js';
import Telegram from '../models/Telegram.js';

import { IStrategy, Ohlcv } from '../abstract/interfaces.js';
import { OrderSide } from '../abstract/enum.js';
import OhlcvModel from '../models/OhlcvModel.js';

export default class MovingAverageTrader extends Trader implements IStrategy {
    private shortMovingAverage = 20;
    private longMovingAverage = 50;
    private position = OrderSide.none;

    public execute() {
        this.telegram.setOnText(/\/searchForEntryPoint/, this.searchForEntryPoint.bind(this));
    }    

    private async searchForEntryPoint() {
        this.telegram.sendMessage({
            message: 'Searching...'
        });

        setInterval(async () => {
            await this.triggerOrderSignal();
        }, 2000);
    }

    private async triggerOrderSignal() {
        const candles = await OhlcvModel.getData() as Ohlcv[];
        const shortAverage = this.calculateMovingAverage(candles, this.shortMovingAverage);
        const longAverage = this.calculateMovingAverage(candles, this.longMovingAverage);

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
        }  
    }

    private calculateMovingAverage(candles: Ohlcv[], period: number): number {
        const closePrices = candles.map((candle) => candle.close);
        const lastPeriodPrices = closePrices.slice(-period);
        const sum = lastPeriodPrices.reduce((total, price) => total + price, 0);

        return sum / period;
    }
}