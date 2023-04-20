import { OHLCV, binance } from 'ccxt';
import { Message } from 'node-telegram-bot-api';
import { Ohlcv, SwingLowHigh } from '../abstract/interfaces.js';
import { config } from '../config/config.js';
import { binanceClient } from '../config/binanceClient.js';
import Telegram from './Telegram.js';

export default class OhlcvModel {
    static timeframe = config.timeFrame;
    static candlesLength = 500;
    static client: binance = binanceClient;
    static market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
    static swingExtremes: SwingLowHigh[] = [];

    static async getData(): Promise<Ohlcv[] | undefined>  {
        if(!this.client.hasFetchOHLCV) {
            Telegram.sendMessage({
                message: 'No OHLCV data for selected pair'
            })
            
            return;
        }
        const initialOhlcv = await this.client.fetchOHLCV(this.market, this.timeframe)

        return this.refactorOhlcv(initialOhlcv);      
    }

    static refactorOhlcv(ohlcv: OHLCV[]) {
        const [
            timestampIndex, 
            openIndex,  
            highIndex,  
            lowIndex,  
            closeIndex,
            volumeIndex
        ] = [0, 1, 2, 3, 4, 5];

        const ohlvSeries = ohlcv.map(ohlcv =>{
            const dateTime = new Date(ohlcv[timestampIndex] * 1000);
            let timeString = dateTime.toString();
    
            return  {
                time: timeString,
                open: ohlcv[openIndex],
                high: ohlcv[highIndex],
                low: ohlcv[lowIndex],
                close: ohlcv[closeIndex],
                volume: ohlcv[volumeIndex]
            }
        });

        return ohlvSeries;
    }

    static getSwingExtremes(): SwingLowHigh[] {
        return this.swingExtremes;    
    }

    static setSwingExtremes(swingExtremes: SwingLowHigh[] ) {
        this.swingExtremes = swingExtremes;    
    }

    static async prepareSwingExtremes(subsetSize: number = 5) {
        const ohlcv = await this.getData() as Ohlcv[];     
        const swingExtremes = this.getSwingEndpoints(ohlcv, subsetSize);    

        this.setSwingExtremes(swingExtremes);
    }

    static getSwingEndpoints(ohlcv: Ohlcv[], subsetSize: number): SwingLowHigh[] {
        // (500 / 5).roundDownToNearestInteger
        const subsetCandleSize = Math.floor(this.candlesLength / subsetSize);  
        let ohlcvSubsets:Ohlcv[][] = []; // Array of subOhlcvArray

        for(let i = 0; i < subsetSize; i++) {
            const ohlcvSubset = ohlcv.splice(0, subsetCandleSize);
            ohlcvSubsets.push(ohlcvSubset);
        }

        return this.prepareSwingEndpoints(ohlcvSubsets);
    }

    static prepareSwingEndpoints(ohlcvSubsets: Ohlcv[][]): SwingLowHigh[] {
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

    static getHighestHigh(candles: Ohlcv[]) {
        return Math.max(...candles.map(candle => candle.high));
    } 
    
    static getLowestLow(candles: Ohlcv[]) {
        return Math.min(...candles.map(candle => candle.low));
    }
}