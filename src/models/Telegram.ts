import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Environment from '../Environment.js'; 
import { START_COMMAND_OPTIONS } from '../store/options.js';
import { TelegramMessage } from '../abstract/interfaces.js';

export default class Telegram {
    static bot: TelegramBot;
    static chatId: string;
    private token: string;

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
                        message: 'GoodBye! Money will be made by other users while you are away'
                    });
                break;
            }
        });
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