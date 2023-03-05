import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Environment from './Environment.js'; 

export default class Telegram {
    bot;
    token;
    chatId;

    constructor() {
        this.token = Environment.getBotToken();
        this.bot = new TelegramBot(this.token, { polling: true });
        this.chatId = Environment.getChatId();
    }

    initBot() {
        this.bot.on('message', (message) => {
            switch (message.text) {
                case '/start':
                    this.bot.sendMessage(
                        this.chatId, 
                        'Hello! I am AgbaCryptoBot, what can I do for you today?',
                        {
                            'reply_markup': {
                                'keyboard': [
                                    [
                                        '/price', 
                                        '/trade'
                                    ],   
                                    ['/performance'],
                                    [
                                        '/table',
                                        '/balance',
                                        '/blyat'
                                    ]
                                ]
                            }
                        });

                    break;

                case '/stop':
                    this.bot.sendMessage(this.chatId, 'GoodBye! Hope to see you soon');
                    
                    break;

                // default:
                //     this.bot.sendMessage(this.chatId, `I don't understand this, check for any typo and try again please`);
                    
                //     break;
            }
        });

        // Matches '/price [symbol]'
        this.bot.onText(/\/price (.+)/, async (message, data) => {
            try {
                let ticker = data[1];
                const price = await this.getCurrencyPrice(ticker);
            
                this.bot.sendMessage(this.chatId, price);
            } catch (error) {
                this.bot.sendMessage(this.chatId, 'Error getting crypto price!, check for typos and try again please');
            }
        });
    }

    async getCurrencyPrice(ticker) {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd;
    }
}