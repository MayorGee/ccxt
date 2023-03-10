import axios from 'axios';

import TelegramBot from 'node-telegram-bot-api';
import Binance from './Binance.js';
import Environment from './Environment.js'; 

export default class Telegram {
    private bot: TelegramBot;
    private token: string;
    private chatId;

    constructor() {
        this.token = Environment.getBotToken() as string;
        this.bot = new TelegramBot(this.token, { polling: true });
        this.chatId = Environment.getChatId() as string;
    }

    public initBot() {
        this.bot.on('message', (message) => {
            switch (message.text) {
                case '/start':
                    this.bot.sendMessage(
                        this.chatId, 
                        'Hello! I am YourCryptoBot, what can I do for you today?',
                        {
                            reply_markup: {
                                'keyboard': [
                                    [
                                        {
                                            text: '/setRange'
                                        },                                        
                                        {
                                            text: '/trade'
                                        }
                                    ],   
                                    [
                                        {
                                            text: '/performance'
                                        }
                                    ],
                                    [
                                        {
                                            text: '/table'
                                        },
                                        {
                                            text: '/balance'
                                        },
                                        {
                                            text: '/blyat'
                                        }
                                    ]
                                ]
                            }
                        }
                    );

                    break;

                case '/stop':
                    this.bot.sendMessage(this.chatId, 'GoodBye! Hope to see you soon');
                    
                    break;

                // default:
                //     this.bot.sendMessage(this.chatId, `I don't understand this, check for any typo and try again please`);
                    
                //     break;
            }
        });

        // Matches '/setRange'
        this.bot.onText(/\/setRange/, async (message) => {
            const marketPrice = await Binance.getMarketPrice();
            this.bot.sendMessage(
                this.chatId, 
                `Current Market Price is ${marketPrice}`,
                {
                    reply_markup: {
                        'keyboard': [
                            [
                                {
                                    text: '/setBuyRange'
                                },                                        
                                {
                                    text: '/setSellRange'
                                }
                            ]
                        ]
                    }
                }
            );
        });

        // Matches '/setBuyRange'
        this.bot.onText(/\/setBuyRange/, async (message) => {
            const rangePrompt = await this.bot.sendMessage(this.chatId, 'Reply this with your lower to upper buy limit (e.g 200 to 500)', {
                reply_markup: {
                    force_reply: true
                }
            });

            this.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
                const range  = message.text?.split('to') as string[];
                const lowerLimit = Number(range[0]);
                const upperLimit = Number(range[1]);

                Binance.prepareBuyPositions(lowerLimit, upperLimit);
                const buyPositions = Binance.getBuyPositions();

                await this.bot.sendMessage(message.chat.id, 
                    `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}\nYou will be making buy orders at the positions: ${buyPositions}`);
            })
        });

        this.bot.onText(/\/buy/, async (message) => {
            const buyPositions = Binance.getBuyPositions();
            const [buyVolume] = await Binance.getVolumes();

            buyPositions.forEach(async (buyPosition) => {
                // await this.client.createLimitBuyOrder(this.market, buyVolume, buyPosition);
                this.bot.sendMessage(this.chatId,`Created Limit Buy Order at ${buyPosition} for ${buyVolume} on ${Binance.market}`);
            });
        });


        // Matches '/setSellRange'
        this.bot.onText(/\/setSellRange/, async (message) => {
            const rangePrompt = await this.bot.sendMessage(this.chatId, 'Reply this with your lower to upper sell limit (e.g 200 to 500)', {
                reply_markup: {
                    force_reply: true
                }
            });

            this.bot.onReplyToMessage(message.chat.id, rangePrompt.message_id, async (message) => {
                const range  = message.text?.split('to') as string[];
                const lowerLimit = Number(range[0]);
                const upperLimit = Number(range[1]);

                await this.bot.sendMessage(message.chat.id, `Lower Trading Limit - ${lowerLimit} \nUpper Trading Limit - ${upperLimit}`);
            })
        });

        // Matches '/price tickerName'
        this.bot.onText(/\/price (.+)/, async (message, data) => {
            try {
                if(data) {
                    let ticker = data[1];
                    const price = await this.getCurrencyPrice(ticker);
                
                    this.bot.sendMessage(this.chatId, price);                    
                } else {
                    this.bot.sendMessage(this.chatId, 'Error getting data');
                }

            } catch (error) {
                this.bot.sendMessage(this.chatId, 'Error getting crypto price!, check for typos and try again please');
            }
        });
    }

    async getCurrencyPrice(ticker: string): Promise<string> {
        const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`);

        return price.data[ticker].usd;
    }
}