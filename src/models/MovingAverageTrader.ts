import Trader from './Trader.js';

import { Ohlcv } from '../abstract/interfaces.js';
import { OrderSide } from '../abstract/enum.js';
import OhlcvModel from './OhlcvModel.js';
import Telegram from './Telegram.js';

export default class MovingAverageTrader extends Trader {
    private shortMovingAverage = 20;
    private longMovingAverage = 50;
    private position = OrderSide.none;
    
    public initTelegram() {
        this.initBot();
        this.telegram.setOnText(/\/searchForEntryPoint/, this.searchForEntryPoint.bind(this));
    }

    private async searchForEntryPoint() {
        Telegram.sendMessage({
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

            Telegram.sendMessage({
                message: `Buy signal triggered at ${longAverage}`
            });
        } else if (shortAverage < longAverage && this.position !== OrderSide.sell) {
            this.position = OrderSide.sell;

            Telegram.sendMessage({
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

    // private getMovingAverage(period: number, index: number, ohlcv: OHLCV[]): number {
    //     let movingAverage = 0;
    //     const periodRange = (period >= index) ? index : period
      
    //     for(let i = 0; i < periodRange; i++) {
    //         movingAverage += (ohlcv[i][2] + ohlcv[i][3]) / 2;
    //     }  

    //     return movingAverage/index;
    // }

    // private getMovingAverages(ohlcv: OHLCV[]): Ohlcv[] {
    //     const [timestampIndex, openIndex, highIndex, lowIndex, closeIndex, volumeIndex] = [0, 1, 2, 3, 4, 5];
    //     const refactoredOhlcv: Ohlcv[] = [];

    //     for (let i = 0; i < ohlcv.length; i++) {
    //         const currentCandle = ohlcv[i];

    //         const movingAverage20 = this.getMovingAverage(20, i, ohlcv);
    //         const movingAverage50 = this.getMovingAverage(50, i, ohlcv);
            
    //         const movingAverageDecision = movingAverage20 > movingAverage50 ? OrderSide.buy : OrderSide.sell;

    //         refactoredOhlcv.push({
    //             time: this.convertTimestamp(currentCandle[timestampIndex]),
    //             open: currentCandle[openIndex],
    //             high: currentCandle[highIndex],
    //             low: currentCandle[lowIndex],
    //             close: currentCandle[closeIndex],
    //             volume: currentCandle[volumeIndex],
    //             movingAverageDecision
    //         }) 
    //     }

    //     return refactoredOhlcv;
    // }
}