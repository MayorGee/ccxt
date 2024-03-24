import { OrderSide } from '../abstract/enum.js';
import { IStrategy, Ohlcv } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

export default class MeanReversion implements IStrategy {
    private lookBackPeriod = 500;
    private position = OrderSide.hold;
    private threshold = 0.02;
    private telegram: Telegram;
    private binance: Binance;
    private symbol = 'DOT/USDT';
    private timeFrame = '30m';
    
    constructor (
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public async initTelegram () {     
        this.telegram.setOnText(/\/findMeanReversionEntry/, this.findMeanReversionEntry.bind(this));
    }

    private findMeanReversionEntry() {
        try {
            this.telegram.sendMessage({
                message: 'Searching For Mean Reversion Entry Points...'
            });
    
            setInterval(async () => {
                await this.triggerOrderSignal();
            }, 2000);
        } catch (error: any) {
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            });
        }
    }

    private async triggerOrderSignal() {
        const candles = await OhlcvModel.getData(this.symbol, this.timeFrame) as Ohlcv[];
        const closePrices = candles.map((candle) => candle.close);
        const meanPrice = this.calculateMeanPrice(closePrices, this.lookBackPeriod);

        // generate buy/sell signals based on price deviations from the mean
        this.determineOrderSide(closePrices, meanPrice);
    }

    private calculateMeanPrice(closePrices: number[], lookBackPeriod: number) {
        const lookBackPeriodPrices = closePrices.slice(-lookBackPeriod);
        const sum = lookBackPeriodPrices.reduce((total, price) => total + price, 0);

        return sum / lookBackPeriod;
    }

    private determineOrderSide(closePrices: number[], meanPrice: number) {
        closePrices.forEach((closePrice) => {
            const deviation = closePrice - meanPrice;

            if (deviation > this.threshold) {
                this.position = OrderSide.sell;

                this.telegram.sendMessage({
                    message: `Sell signal found at ${closePrice}`
                });
            } else if (deviation < -this.threshold) {
                this.position = OrderSide.buy;

                this.telegram.sendMessage({
                    message: `Buy signal found at  ${closePrice}`
                });
            } else {
                this.position = OrderSide.hold;
            }
        });
    }
}