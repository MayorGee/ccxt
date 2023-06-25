import axios from 'axios';
import Binance from './Binance.js';
import Telegram from './Telegram.js';
import Indicator from './Indicator.js';
import TelegramBot from 'node-telegram-bot-api';
import { MOVING_AVERAGE_COMMAND_OPTIONS, SWING_COMMAND_OPTIONS } from '../store/options.js';
import { config } from '../config/config.js';
import SwingTrader from '../strategies/SwingTrader.js';

export default class Trader {
    public telegram = new Telegram();
    protected binance = new Binance();
    protected indicator = new Indicator();
    protected symbol = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
    protected timeframe = config.timeFrame;

    public initBot() {
        this.telegram.initBot();
        // this.telegram.setOnText(/\/swing/, this.selectSwingStrategy.bind(this));
        // this.telegram.setOnText(/\/movingAverage/, this.selectMovingAverageStrategy.bind(this));
        // this.telegram.setOnText(/\/marketMaker/, this.selectMarketMakerStrategy.bind(this));
        this.telegram.setOnText(/\/price (.+)/, this.showTickerPriceCommand.bind(this));
        this.telegram.setOnText(/\/showRSI/, this.showRSI.bind(this));
    }

    // private selectMovingAverageStrategy() {
    //     this.telegram.sendMessage({ 
    //         message: `Moving Average Strategy Selected! \nSelect from the options below to proceed`,
    //         basicOptions: MOVING_AVERAGE_COMMAND_OPTIONS
    //     });
    // }

    // private selectMarketMakerStrategy() {
    //     this.telegram.sendMessage({ 
    //         message: `Market Making Strategy Selected!`
    //     });
    // }

    // private selectSwingStrategy() {
    //     this.telegram.sendMessage({ 
    //         message: `Swing Strategy Selected! \nSelect from the options below to proceed`,
    //         basicOptions: SWING_COMMAND_OPTIONS
    //     });
    // }

    private async showTickerPriceCommand(message: TelegramBot.Message, data: RegExpExecArray) {     
        try {
            if(data) {
                let ticker = data[1];
                const price = await this.getCurrencyPrice(ticker);
                 
                this.telegram.sendMessage({
                    message: price
                });  
    
            } else {
                this.telegram.sendMessage({ 
                    message: 'Error getting data'
                });
            }
        } catch (error: any) {
            console.log('ERROR: ', error.message);
        }
    }

    private async showRSI() {
        const rsi = await this.indicator.getRSI();

        this.telegram.sendMessage({
            message: `Current RSI is ${rsi}`
        });
    }

    private async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd.toString();
    }

    protected convertTimestamp(timestamp: number): string {
        const dateTime = new Date(timestamp * 1000);
        return dateTime.toString();
    }
}