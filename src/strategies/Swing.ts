import { IStrategy, Ohlcv, SwingLowHigh } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

export default class Swing implements IStrategy {
    private swingExtremes: SwingLowHigh[] = [];
    static candlesLength = 500;
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

    public initTelegram() {
        this.telegram.setOnText(/\/buySwing/, this.buySwingCommand.bind(this));
        this.telegram.setOnText(/\/showSwingEndPoints/, this.showSwingEndPoints.bind(this));
    }

    private async buySwingCommand() {
        const swingExtremes = this.getSwingExtremes();

        swingExtremes.forEach(async({ lowestLow }: SwingLowHigh) => {
            // await this.binance.createLimitBuyOrder(lowestLow);
            this.telegram.sendMessage({
                message: `Created Limit Buy at - ${lowestLow}`
            });
        });
    }

    private showSwingEndPoints() {
        const swingExtremes = this.getSwingExtremes();
    
        swingExtremes.forEach((swingExtreme: SwingLowHigh) => {
            this.telegram.sendMessage({
                message: `Highest High - ${swingExtreme.highestHigh} \nLowest Low - ${swingExtreme.lowestLow}`
            });
        });
    }

    public async prepareSwingExtremes(subsetSize: number = 5) {
        const ohlcv = await OhlcvModel.getData(this.symbol, this.timeFrame) as Ohlcv[];     
        const swingExtremes = this.getSwingEndpoints(ohlcv, subsetSize);    

        this.setSwingExtremes(swingExtremes);
    }

    public getSwingEndpoints(ohlcv: Ohlcv[], subsetSize: number): SwingLowHigh[] {
        // (500 / 5).roundDownToNearestInteger
        const subsetCandleSize = Math.floor(Swing.candlesLength / subsetSize);  
        let ohlcvSubsets:Ohlcv[][] = []; // Array of subOhlcvArray

        for(let i = 0; i < subsetSize; i++) {
            const ohlcvSubset = ohlcv.splice(0, subsetCandleSize);
            ohlcvSubsets.push(ohlcvSubset);
        }

        return this.prepareSwingEndpoints(ohlcvSubsets);
    }

    private prepareSwingEndpoints(ohlcvSubsets: Ohlcv[][]): SwingLowHigh[] {
        const swingData: SwingLowHigh[] = [];

        ohlcvSubsets.forEach((ohlcvSubset) => {
            const lowestLow = this.getLowestLow(ohlcvSubset);
            const highestHigh = this.getHighestHigh(ohlcvSubset);

            const swingEndPoints = {
                lowestLow,
                highestHigh
            };
            
            swingData.push(swingEndPoints);
        })

        return swingData;
    }

    public getSwingExtremes(): SwingLowHigh[] {
        return this.swingExtremes;    
    }

    private setSwingExtremes(swingExtremes: SwingLowHigh[] ) {
        this.swingExtremes = swingExtremes;    
    }

    protected getHighestHigh(candles: Ohlcv[]) {
        return Math.max(...candles.map(candle => candle.high));
    } 
    
    protected getLowestLow(candles: Ohlcv[]) {
        return Math.min(...candles.map(candle => candle.low));
    }
}