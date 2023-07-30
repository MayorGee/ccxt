import axios from 'axios';
import Telegram from './Telegram.js';
import Indicator from './Indicator.js';
import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config.js';

export default class Trader {
    public telegram = new Telegram();
    protected indicator = new Indicator();
    protected timeframe = config.timeFrame;

    public initBot() {
        this.telegram.initBot();
        this.telegram.setOnText(/\/price (.+)/, this.showTickerPriceCommand.bind(this));
        this.telegram.setOnText(/\/showRSI/, this.showRSI.bind(this));
    }

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
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            }); 
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