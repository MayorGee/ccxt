import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Binance from './Binance.js';
import OhlcvModel from './OhlcvModel.js';
import Telegram from './Telegram.js';
import Indicator from './Indicator.js';

const binance = new Binance();
const telegram = new  Telegram();

const params = {
    'stopLoss': {
        'type': 'limit', // or 'market'
        'price': binance.stopLoss,
        'triggerPrice': 101.25,
    },
    // 'takeProfit': {
    //     'type': 'market',
    //     'triggerPrice': 150.75,
    // }
}

export default class Trader {

    public init() {
        telegram.initBot();
        telegram.setOnText(/\/showMarketPrice/, this.showMarketPriceCommand);
        telegram.setOnText(/\/buy/, this.buySwingCommand);
        telegram.setOnText(/\/price (.+)/, this.showTickerPriceCommand);
        telegram.setOnText(/\/showSwingEndPoints/, this.showSwingEndPoints);
        telegram.setOnText(/\/showRSI/, this.showRSI);
    }

    private async showMarketPriceCommand(message: TelegramBot.Message) {
        const marketPrice = await binance.getMarketPrice();
        const currentMarketPriceMessage = `Current Market Price for ${binance.market} is ${marketPrice}`;

        Telegram.sendMessage({
            message: currentMarketPriceMessage
        });
    }

    private async buySwingCommand() {
        const swingExtremes = OhlcvModel.getSwingExtremes();

        swingExtremes.forEach(async(swingExtreme) => {
            // await binance.createLimitBuyOrder();
            Telegram.sendMessage({
                message: `Created Limit Buy at -  ${swingExtreme.lowestLow}`
            });
        });
    }

    private async showTickerPriceCommand(message: TelegramBot.Message, data: RegExpExecArray) {
        try {
            if(data) {
                let ticker = data[1];
                console.log('Ticker: ', ticker);

                const price = await this.getCurrencyPrice(ticker);

                console.log('PRICE: ', price);
                 
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

    private showSwingEndPoints() {
        const swingExtremes = OhlcvModel.getSwingExtremes();
    
        swingExtremes.forEach((swingExtreme) => {
            Telegram.sendMessage({
                message: `Highest High - ${swingExtreme.highestHigh} \nLowest Low - ${swingExtreme.lowestLow}`
            });
        });

    }

    private async showRSI() {
        const rsi = await Indicator.getRSI();

        Telegram.sendMessage({
            message: `Current RSI is ${rsi}`
        });
    }

    private async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        console.log('LOOK HERE: ', price.data[ticker].usd);

        return price.data[ticker].usd.toString();
    }
}