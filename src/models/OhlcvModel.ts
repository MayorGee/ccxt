import { OHLCV, binance } from 'ccxt';
import { Ohlcv } from '../abstract/interfaces.js';
import { config } from '../config/config.js';
import { binanceClient } from '../config/binanceClient.js';
import Telegram from './Telegram.js';

export default class OhlcvModel {
    static timeframe = config.timeFrame;
    static client: binance = binanceClient;
    static market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
     
    static async getData(): Promise<Ohlcv[] | undefined>  {
        if(!this.client.hasFetchOHLCV) {
            console.log('No OHLCV data for selected pair');
            
            return;
        }

        const initialOhlcv = await this.client.fetchOHLCV(this.market, this.timeframe)

        return this.refactorOhlcv(initialOhlcv);      
    }

    static  refactorOhlcv(ohlcv: OHLCV[]) {
        const [
            timestampIndex, 
            openIndex,  
            highIndex,  
            lowIndex,  
            closeIndex,
            volumeIndex
        ] = [0, 1, 2, 3, 4, 5];

        const ohlvSeries = ohlcv.map(ohlcv =>{
            return  {
                time: this.convertTimestamp(ohlcv[timestampIndex]),
                open: ohlcv[openIndex],
                high: ohlcv[highIndex],
                low: ohlcv[lowIndex],
                close: ohlcv[closeIndex],
                volume: ohlcv[volumeIndex]
            }
        });

        return ohlvSeries;
    }

    static convertTimestamp(timestamp: number): string {
        const dateTime = new Date(timestamp * 1000);
        return dateTime.toString();
    }
}