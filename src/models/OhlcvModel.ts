import moment from 'moment';

import { OHLCV, binance } from 'ccxt';
import { Ohlcv } from '../abstract/interfaces.js';
import { config } from '../config/config.js';
import { binanceClient } from '../config/binanceClient.js';

export default class OhlcvModel {
    static timeframe = config.timeFrame;
    static client: binance = binanceClient;
    static market = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
     
    static async getData(market: string, timeFrame: string): Promise<Ohlcv[] | undefined>  {
        if(!this.client.fetchOHLCV) {
            // Telegram.sendMessage({
            //     message: 'No OHLCV data for selected pair'
            // })

            console.log('No OHLCV data for selected pair');
            
            return;
        }

        const initialOhlcv = await this.client.fetchOHLCV(market, timeFrame);

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
        const utcDateTime = moment.utc(timestamp);
        const utcPlus3DateTime = utcDateTime.add(3, 'hours');
        const dateTime = utcPlus3DateTime.format('YYYY-MM-DD HH:mm:ss');
    
        return dateTime;
    }
}