import TelegramBot from "node-telegram-bot-api";
import Environment from "./Environment.js"; 

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
            console.log(message.text);

            this.bot.sendMessage(this.chatId, 'Message succesfully sent to console')
        });
    }
}