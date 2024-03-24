import axios from 'axios';
import Telegram from './Telegram.js';
import Binance from './Binance.js';
import Indicator from './Indicator.js';
import TelegramBot from 'node-telegram-bot-api';

import MarketMaking from '../strategies/MarketMaking.js';
import MovingAverageCrossOver from '../strategies/MovingAverageCrossOver.js';
import Swing from '../strategies/Swing.js';
import MeanReversion from '../strategies/MeanReversion.js';
import BollingerBands from '../strategies/BollingerBands.js';
import Breakout from '../strategies/Breakout.js';
import Arbitrage from '../strategies/Arbitrage.js';
import Momentum from '../strategies/Momentum.js';

import { 
    MOVING_AVERAGE_COMMAND_OPTIONS, 
    SWING_COMMAND_OPTIONS,
    ARBITRAGE_COMMAND_OPTIONS,
    BOLLINGER_COMMAND_OPTIONS
} from '../store/options.js';


export default class Trader {
    public telegram = new Telegram();
    public binance = new Binance(); 
    
    public initBot() {
        this.telegram.initBot();
        this.telegram.setOnText(/\/price (.+)/, this.showTickerPriceCommand.bind(this));

        this.initAllStrategies();
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

    private async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd.toString();
    }

    protected convertTimestamp(timestamp: number): string {
        const dateTime = new Date(timestamp * 1000);
        return dateTime.toString();
    }

    private initAllStrategies() {
        this.telegram.setOnText(/\/marketMaker/, () => {
            const marketMaker = new MarketMaking(this.telegram, this.binance);
            marketMaker.initTelegram();
        
            this.telegram.sendMessage({ 
                message: `Proceeding to Making Market!`
            });
        });
        
        this.telegram.setOnText(/\/movingAverage/, () => {
            const movingAverageTrader = new MovingAverageCrossOver(this.telegram);
            movingAverageTrader.initTelegram();

            this.telegram.sendMessage({ 
                message: `Moving Average Strategy Selected! \nSelect from the options below to proceed`,
                basicOptions: MOVING_AVERAGE_COMMAND_OPTIONS
            });
        });

        this.telegram.setOnText(/\/swing/, () => {
            const swingTrader = new Swing(this.telegram, this.binance);
            swingTrader.prepareSwingExtremes();
            swingTrader.initTelegram();

            this.telegram.sendMessage({ 
                message: `Swing Strategy Selected! \nSelect from the options below to proceed`,
                basicOptions: SWING_COMMAND_OPTIONS
            });
        }); 

        this.telegram.setOnText(/\/meanReversion/, () => {
            const meanReversionTrader = new MeanReversion(this.telegram, this.binance);
            meanReversionTrader.initTelegram();
         
            this.telegram.sendMessage({ 
                message: `Proceeding to Mean Reversion Strategy!`
            });
        });
         
        this.telegram.setOnText(/\/bollingerBands/, () => {
            const bollingerBands = new BollingerBands(this.telegram, this.binance);
            bollingerBands.initTelegram();
         
            this.telegram.sendMessage({ 
                message: `Proceeding to Bollinger Bands Strategy!`,
                basicOptions: BOLLINGER_COMMAND_OPTIONS
            });
        });
         
        this.telegram.setOnText(/\/breakout/, () => {
            const breakout = new Breakout(this.telegram, this.binance);
            breakout.initTelegram();
         
            this.telegram.sendMessage({ 
                message: `Proceeding to Breakout Strategy!`
            });
        });

        this.telegram.setOnText(/\/arbitrage/, () => {
            const arbitrage = new Arbitrage(this.telegram, this.binance);
            arbitrage.initTelegram();
         
            this.telegram.sendMessage({ 
                message: `Proceeding to Arbitrage Strategy!`,
                basicOptions: ARBITRAGE_COMMAND_OPTIONS
            });
        });
        
        this.telegram.setOnText(/\/momentum/, () => {
            const momentum = new Momentum(this.telegram, this.binance);
            momentum.initTelegram();
        
            this.telegram.sendMessage({ 
                message: `Proceeding to Momentum Strategy!`
            });
        });
    }
}