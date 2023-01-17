import dotenv from 'dotenv';
dotenv.config();

export default class Environment {
    static getApiKey() {
        return process.env.API_KEY;
    }

    static getApiSecretKey() {
        return process.env.API_SECRET_KEY;
    }

    static getAssetTicker() {
        return process.env.ASSET_TICKER;
    }

    static getAssetName() {
        return process.env.ASSET_NAME;
    }

    static getBaseTicker() {
        return process.env.BASE_TICKER;
    }

    static getBaseName() {
        return process.env.BASE_NAME;
    }

    static getAllocation() {
        return process.env.ALLOCATION;
    }

    static getSpread() {
        return process.env.SPREAD;
    }

    static getTickInterval() {
        return process.env.TICK_INTERVAL;
    }

    static getBotToken() {
        return process.env.BOT_TOKEN;
    }

    static getChatId() {
        return process.env.CHAT_ID;
    }
}