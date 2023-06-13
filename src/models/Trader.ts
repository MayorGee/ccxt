import axios from 'axios';
import Binance from './Binance.js';
import Telegram from './Telegram.js';
import Indicator from './Indicator.js';
import TelegramBot from 'node-telegram-bot-api';
import { MOVING_AVERAGE_COMMAND_OPTIONS, SWING_COMMAND_OPTIONS } from '../store/options.js';
import { config } from '../config/config.js';

const telegram = new Telegram();
const binance = new Binance();

export default class Trader {
    protected telegram!: Telegram;
    protected binance!: Binance;
    protected symbol = `${config.assetTicker}/${config.baseTicker}`;  // BTC/USDT;
    protected timeframe = config.timeFrame;

    public initBot() {
        this.telegram = telegram;
        this.binance = binance;
        this.telegram.initBot();
        this.telegram.setOnText(/\/swing/, this.selectSwingStrategy.bind(this));
        this.telegram.setOnText(/\/movingAverage/, this.selectMovingAverageStrategy.bind(this));
        this.telegram.setOnText(/\/price (.+)/, this.showTickerPriceCommand.bind(this));
        this.telegram.setOnText(/\/showRSI/, this.showRSI.bind(this));
    }

    private selectMovingAverageStrategy() {
        Telegram.sendMessage({ 
            message: `Moving Average Strategy Selected! \nSelect from the options below to proceed`,
            basicOptions: MOVING_AVERAGE_COMMAND_OPTIONS
        });
    }

    private selectSwingStrategy() {
        Telegram.sendMessage({ 
            message: `Swing Strategy Selected! \nSelect from the options below to proceed`,
            basicOptions: SWING_COMMAND_OPTIONS
        });
    }

    public initTelegram() {}

    private async showTickerPriceCommand(message: TelegramBot.Message, data: RegExpExecArray) {     
        try {
            if(data) {
                let ticker = data[1];
                const price = await this.getCurrencyPrice(ticker);
                 
                Telegram.sendMessage({
                    message: price
                });  
    
            } else {
                Telegram.sendMessage({ 
                    message: 'Error getting data'
                });
            }
        } catch (error: any) {
            console.log('ERROR: ', error.message);
        }
    }

    private async showRSI() {
        const rsi = await Indicator.getRSI();

        Telegram.sendMessage({
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