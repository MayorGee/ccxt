import TelegramBot from 'node-telegram-bot-api';
import Environment from '../Environment.js'; 
import { START_COMMAND_OPTIONS, STRATEGY_OPTIONS } from '../store/options.js';
import { TelegramMessage } from '../abstract/interfaces.js';

export default class Telegram {
    private bot: TelegramBot;
    private chatId: string;
    private token: string;

    constructor() {
        this.token = Environment.getBotToken() as string;
        this.bot = new TelegramBot(this.token, { polling: true });
        this.chatId = Environment.getChatId() as string;
    }

    public initBot() {
        this.bot.on('polling_error', console.log);
        this.bot.on('message', (message) => {
            const text = message.text;

            if (text?.startsWith('/')) {
                const command = text.substring(1);
                switch (command) {
                    case 'start':
                        this.sendMessage({ 
                            message: 'I\'m awake sir!',
                            basicOptions: START_COMMAND_OPTIONS
                        }); 
                    break;

                    case 'chooseStrategy':
                        this.promptStrategySelection();
                    break;
    
                    case 'stop':
                        this.sendMessage({
                            message: 'GoodBye! Money will be made by other users while you are away'
                        });
                    break;
                }
            }
        });
    }

    private async promptStrategySelection(): Promise<void> {
        this.sendMessage({
            message: 'Choose a strategy from the options below',
            basicOptions: STRATEGY_OPTIONS
        });
    }

    public setOnText(regEx: RegExp, callBack: any) {
        this.bot.onText(RegExp(regEx), function(message, data) {
            callBack(message, data);
        })
    }

    public async sendMessage({
        chatId = this.chatId, 
        message, 
        basicOptions = {}
    }:TelegramMessage): Promise<TelegramBot.Message> {
        const messagePrompt = this.bot.sendMessage(chatId, message, basicOptions);
        return messagePrompt;
    }
}