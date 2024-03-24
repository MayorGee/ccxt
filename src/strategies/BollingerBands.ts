import { BollingerBand, IStrategy, Ohlcv } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

// incorrect take profit for long signal
// incorrect short signal
// unprecise rsi

export default class BollingerBands implements IStrategy {
    private bbPeriod = 20;
    private rsiPeriod = 14;
    private orderSize = 50;
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
        this.telegram.setOnText(/\/checkBollingerBandOpportunity/, this.checkBollingerBandOpportunity.bind(this));
    }

    private checkBollingerBandOpportunity() {
        try {
            this.telegram.sendMessage({
                message: 'Searching...' 
            });
    
            // setInterval(async () => {
                // await this.triggerOrderSignal();
            // }, 4000);

            this.triggerOrderSignal();
        } catch (error: any) {
            console.log('Something went wrong ', error.message);
        }
    }

    private async triggerOrderSignal() {
        const candles = await OhlcvModel.getData(this.symbol, this.timeFrame) as Ohlcv[];
        const bollingerBands_4 = this.getBollingerBands(candles, 4);
        const bollingerBands_2 = this.getBollingerBands(candles, 2);

        const rsi =  this.calculateRSI(candles) as number[];

        for (let i = 0; i < candles.length; i++) {
            const { high, low } = candles[i];

            const buyLowerBand = bollingerBands_4[i].lowerBand;
            const buyUpperBand = bollingerBands_2[i].upperBand;

            const sellLowerBand = bollingerBands_2[i].lowerBand;
            const sellUpperBand = bollingerBands_4[i].upperBand;

            const candleRsi = rsi[i];

            const isSignalBuy = low <= buyLowerBand && candleRsi > 30;
            const isSignalSell = high >= sellUpperBand && candleRsi < 70;

                // console.group(i);
                // console.log('upperBand: ', upperBand);
                // console.log('close: ', close);
                // console.log('lowerBand: ', lowerBand);
                // console.log('rsi: ', candleRsi);
                // console.groupEnd();
                
            if (isSignalBuy) {
                this.telegram.sendMessage({
                    message: `LONG SIGNAL \nTIME: ${candles[i].time} \nENTRY: ${low} \nTAKE PROFIT: ${buyUpperBand} \nRSI: ${candleRsi} \nUPPER_BAND: ${buyUpperBand} \nLOWER_BAND: ${buyLowerBand}`
                });

                //     const order = this.binance.createOrder(
                //         this.symbol,
                //         OrderType.limit,
                //         OrderSide.buy',
                //         this.orderSize,
                //         close,
                //         {
                //             'takeProfit': {
                //                 'price': upperBand
                //             }
                //         }
                //     )
                // }
            } 
            
            if (isSignalSell) {
                this.telegram.sendMessage({
                    message: `SHORT SIGNAL \nTIME: ${candles[i].time} \nENTRY: ${high} \nTAKE PROFIT: ${sellLowerBand} \nRSI: ${candleRsi} \nUPPER_BAND: ${sellUpperBand} \nLOWER_BAND: ${sellLowerBand}`
                });
            }            
        } 
    }

    private getBollingerBands(candles: Ohlcv[], standardDeviation: number) {
        const bollingerBands: BollingerBand[] = [];

        for (let i = 0; i < candles.length; i++) {
            const close = candles[i].close;
            const deviation = standardDeviation * this.calculateStandardDeviation(candles);
        
            bollingerBands.push({
                upperBand: close + deviation,
                lowerBand: close - deviation
            });
        }

        return bollingerBands;
    }

    private calculateStandardDeviation(candles: Ohlcv[]): number {
        if (candles.length < this.bbPeriod) {
            throw new Error('Length exceeds the number of candles available');
        }
        
        const subset = candles.slice(candles.length - this.bbPeriod, candles.length);
        const closes = subset.map(candle => candle.close);
        const mean = closes.reduce((sum, value) => sum + value, 0) / this.bbPeriod;
        const squaredDifferences = closes.map(value => Math.pow(value - mean, 2));
        const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / this.bbPeriod;
        const standardDeviation = Math.sqrt(variance);
        
        return standardDeviation;
    }

    private calculateRSI(candles: Ohlcv[]): number[] {
        const { averageGain, averageLoss } = this.getAverageGainLoss(candles);  
        const relativeStrengths = this.getRelativeStrength(candles, averageGain, averageLoss);   

        const rsi: number[] = relativeStrengths.map((relativeStrength) => 100 - 100 / (1 + relativeStrength));

        while (rsi.length < candles.length) {
            rsi.unshift(0);
        }

        return rsi;
    }

    private getRelativeStrength(candles: Ohlcv[], averageGain: number, averageLoss: number) {
        const relativeStrengths: number[] = [];
        relativeStrengths.push(averageGain / averageLoss);

        for (let i = this.rsiPeriod; i < candles.length - 1; i++) {
            const currentCandle = candles[i];
            const previousCandle = candles[i - 1];

            const priceChange = currentCandle.close - previousCandle.close;

            const gain = priceChange > 0 ? priceChange : 0;
            const loss = priceChange < 0 ? -priceChange : 0;

            const smoothedAverageGain = (averageGain * (this.rsiPeriod - 1) + gain) / this.rsiPeriod;
            const smoothedAverageLoss = (averageLoss * (this.rsiPeriod - 1) + loss) / this.rsiPeriod;

            averageGain = smoothedAverageGain;
            averageLoss = smoothedAverageLoss;

            const relativeStrength = smoothedAverageGain / smoothedAverageLoss;
            relativeStrengths.push(relativeStrength);
        }

        return relativeStrengths;
    }

    private getAverageGainLoss(candles: Ohlcv[]) {
        const gains: number[] = [];
        const losses: number[] = [];

        for (let i = 1; i < candles.length; i++) {
            const currentCandle = candles[i];
            const previousCandle = candles[i - 1];

            const priceChange = currentCandle.close - previousCandle.close;

            if (priceChange > 0) {
                gains.push(priceChange);
                losses.push(0);
            } else {
                gains.push(0);
                losses.push(-priceChange);
            }
        }

        let averageGain = this.calculateAverage(gains.slice(0, this.rsiPeriod));
        let averageLoss = this.calculateAverage(losses.slice(0, this.rsiPeriod));

        return { averageGain, averageLoss };
    }

    private calculateAverage(values: number[]): number {
        const sum = values.reduce((acc, value) => acc + value, 0);
    
        return sum / values.length;
    }

}