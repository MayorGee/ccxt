import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Environment from '../Environment.js'; 
import { START_COMMAND_OPTIONS } from '../store/options.js';
import { TelegramMessage } from '../abstract/interfaces.js';

export default class Telegram {
    static bot: TelegramBot;
    private token: string;
    static chatId: string;

    constructor() {
        this.token = Environment.getBotToken() as string;
        Telegram.bot = new TelegramBot(this.token, { polling: true });
        Telegram.chatId = Environment.getChatId() as string;
    }

    public initBot() {
        Telegram.bot.on('polling_error', console.log);

        Telegram.bot.on('message', (message) => {
            switch (message.text) {
                case '/start':
                    Telegram.sendMessage({ 
                        message: 'Lets make some coin baby!',
                        basicOptions: START_COMMAND_OPTIONS
                    });
                break;

                case '/stop':
                    Telegram.sendMessage({
                        message: 'GoodBye! Money will be made by users while you are away'
                    });
                break;
            }
        });


        // Telegram.bot.onText(/\/setRange/, async (message) => {
        //     const marketPrice = await Binance.getMarketPrice();
        //     const currentMarketPriceMessage = `Current Market Price is ${marketPrice}`;

        //     Telegram.sendMessage({
        //         message: currentMarketPriceMessage, 
        //         basicOptions: SET_RANGE_OPTIONS
        //     });

        // });


        // Telegram.bot.onText(/\/setBuyRange/, async (message) => {
        //     const rangePrompt = await Telegram.sendMessage({
        //         message: 'Reply this with your lower to upper buy limit (e.g 200 to 500)', 
        //         basicOptions: SET_RANGE_REPLY
        //     });

        //     Telegram.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
        //         const range  = message.text?.split('to') as string[];
        //         const lowerLimit = Number(range[0]);
        //         const upperLimit = Number(range[1]);

        //         Binance.prepareBuyPositions(lowerLimit, upperLimit);
        //         const buyPositions = Binance.getBuyPositions();

        //         await Telegram.sendMessage({
        //             chatId:  message.chat.id, 
        //             message: `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}\nYou will be making buy orders at the positions: ${buyPositions}`
        //         });
        //     })
        // });


        // Telegram.bot.onText(/\/setSellRange/, async (message) => {
        //     const rangePrompt = await Telegram.sendMessage({ 
        //         message: 'Reply this with your lower to upper sell limit (e.g 200 to 500)',
        //         basicOptions: SET_RANGE_REPLY
        //     });

        //     Telegram.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
        //         const range  = message.text?.split('to') as string[];
        //         const lowerLimit = Number(range[0]);
        //         const upperLimit = Number(range[1]);

        //         await Telegram.sendMessage({
        //             chatId: message.chat.id, 
        //             message: `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}`
        //         });
        //     })
        // });
    }

    public setOnText(regEx: RegExp, callBack: any) {
        Telegram.bot.onText(RegExp(regEx), function(message, data) {
            callBack(message, data);
        })
    }

    async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd;
    }

    static async sendMessage({
        chatId = Telegram.chatId, 
        message, 
        basicOptions = {}
    }:TelegramMessage): Promise<TelegramBot.Message> {
        const messagePrompt = Telegram.bot.sendMessage(chatId, message, basicOptions);
        return messagePrompt;
    }
}