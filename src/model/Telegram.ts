import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Binance from './Binance.js';
import Environment from '../Environment.js'; 
import { 
    SET_RANGE_OPTIONS, 
    SET_RANGE_REPLY, 
    START_COMMAND_OPTIONS 
} from '../data/options-markup.js';
import Position from './Position.js';
import Base from './Base.js';

export default class Telegram {
    private bot: TelegramBot;
    private token: string;
    private chatId: string;

    constructor() {
        this.token = Environment.getBotToken() as string;
        this.bot = new TelegramBot(this.token, { polling: true });
        this.chatId = Environment.getChatId() as string;
    }

    public initBot() {
        this.bot.on('message', (message) => {
            switch (message.text) {
                case '/start':
                    this.sendMessage(
                        this.chatId, 
                        'Hello! I am YourCryptoBot, what can I do for you today?',
                        START_COMMAND_OPTIONS
                    );
                break;

                case '/stop':
                    this.sendMessage(this.chatId, 'GoodBye! Hope to see you soon');
                break;
            }
        });

        this.bot.onText(/\/setRange/, async (message) => {
            const marketPrice = await Binance.getMarketPrice();
            const currentMarketPriceMessage = `Current Market Price is ${marketPrice}`;

            this.sendMessage(
                this.chatId,
                currentMarketPriceMessage, 
                SET_RANGE_OPTIONS
            );

        });

        this.bot.onText(/\/setBuyRange/, async (message) => {
            const rangePrompt = await this.sendMessage
            (
                this.chatId,
                'Reply this with your lower to upper buy limit (e.g 200 to 500)', 
                SET_RANGE_REPLY
            );

            this.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
                const range  = message.text?.split('to') as string[];
                const lowerLimit = Number(range[0]);
                const upperLimit = Number(range[1]);

                Position.prepareBuyPositions(lowerLimit, upperLimit);
                const buyPositions = Position.getBuyPositions();

                await this.sendMessage(
                    message.chat.id, 
                    `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}\nYou will be making buy orders at the positions: ${buyPositions}`
                );
            })
        });

        this.bot.onText(/\/buy/, async (message) => {
            const buyPositions =  Position.getBuyPositions();
            const buyVolume = await Base.getBuyVolume();

            buyPositions.forEach(async (buyPosition) => {
                // await Binance.createLimitBuyOrders();
                this.sendMessage(
                    this.chatId,
                    `Created Limit Buy Order at ${buyPosition} for ${buyVolume} on ${Binance.market}`
                );
            });
        });

        this.bot.onText(/\/setSellRange/, async (message) => {
            const rangePrompt = await this.sendMessage(
                this.chatId, 
                'Reply this with your lower to upper sell limit (e.g 200 to 500)',
                SET_RANGE_REPLY
            );

            this.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
                const range  = message.text?.split('to') as string[];
                const lowerLimit = Number(range[0]);
                const upperLimit = Number(range[1]);

                await this.sendMessage(
                    message.chat.id, 
                    `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}`
                );
            })
        });

        this.bot.onText(/\/price (.+)/, async (message, data) => {
            try {
                if(data) {
                    let ticker = data[1];
                    const price = await this.getCurrencyPrice(ticker);
                
                    this.sendMessage(
                        this.chatId, 
                        price
                    );                    
                } else {
                    this.sendMessage(
                        this.chatId, 
                        'Error getting data'
                    );
                }

            } catch (error) {
                this.sendMessage(
                    this.chatId, 
                    'Error getting crypto price!, check for typos and try again please'
                );
            }
        });
    }

    async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd;
    }

    async sendMessage(
        chatId: string | number, 
        message: string, 
        basicOptions: Object = {}
    ): Promise<TelegramBot.Message> {
        const messagePrompt = this.bot.sendMessage(chatId, message, basicOptions);
        return messagePrompt;
    }
}