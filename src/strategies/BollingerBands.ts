import { OrderSide } from '../abstract/enum.js';
import { BollingerBand, IStrategy, Ohlcv } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

export default class MeanReversion implements IStrategy {
    private period = 20;
    private standardDeviation = 2;
    private deviationThreshold = 0.02;
    private position = OrderSide.hold;
    private telegram: Telegram;
    private binance: Binance;
    private bollingerBands: BollingerBand = {
        upperBand: 0,
        lowerBand: 0
    }
    
    constructor (
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public async initTelegram () {     
        this.telegram.setOnText(/\/findBollingerBandsEntry/, this.findEntryPoint.bind(this));
    }

    private findEntryPoint() {
        try {
            this.telegram.sendMessage({
                message: 'Searching For Bollinger Bands Entry Points...'
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
        const candles = await OhlcvModel.getData() as Ohlcv[];
        const closePrices = candles.map((candle) => candle.close);
        
        this.calculateBollingerBands(closePrices);

        // generate buy/sell signals based on the price position relative to the bands
        this.determineOrderSide(closePrices);
    }

    private calculateBollingerBands(closePrices: number[]) {
        const middleBand = this.calculateSimpleMovingAverage(closePrices);

        const squaredDiferrences = closePrices.map((closePrice) => Math.pow(closePrice - middleBand, 2));
        const meanSquaredDifference = this.calculateSimpleMovingAverage(squaredDiferrences);
        const standardDeviation = Math.sqrt(meanSquaredDifference);

        this.bollingerBands.upperBand = middleBand + (this.standardDeviation * standardDeviation);
        this.bollingerBands.lowerBand = middleBand - (this.standardDeviation * standardDeviation);
    }

    private calculateSimpleMovingAverage(closePrices: number[]) {
        const lastPeriodPrices = closePrices.slice(-this.period);
        const sum = lastPeriodPrices.reduce((total, price) => total + price, 0);

        return sum / this.period;
    }

    private determineOrderSide(closePrices: number[]) {
        const { upperBand, lowerBand } = this.bollingerBands;

        closePrices.forEach((closePrice) => {
            if (closePrice > upperBand + this.deviationThreshold) {
                this.position = OrderSide.sell;

                this.telegram.sendMessage({
                    message: `Sell signal found at ${closePrice}`
                });
            } else if (closePrice < lowerBand - this.deviationThreshold) {
                this.position = OrderSide.buy;

                this.telegram.sendMessage({
                    message: `Buy signal found at ${closePrice}`
                });
            } else {
                this.position = OrderSide.hold;
            }
        });
    }
}