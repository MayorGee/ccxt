import dotenv from 'dotenv';
dotenv.config();

export default class Environment {
    static getApiKey(): string | undefined {
        return process.env.API_KEY;
    }

    static getApiSecretKey(): string | undefined {
        return process.env.API_SECRET_KEY;
    }

    static getAssetTicker(): string | undefined {
        return process.env.ASSET_TICKER;
    }

    static getAssetName(): string | undefined {
        return process.env.ASSET_NAME;
    }

    static getBaseTicker(): string | undefined {
        return process.env.BASE_TICKER;
    }

    static getBaseName(): string | undefined {
        return process.env.BASE_NAME;
    }

    static getAllocation(): string | undefined {
        return process.env.ALLOCATION;
    }

    static getStopLoss(): string | undefined {
        return process.env.STOP_LOSS;
    }

    static getTradePositionRange(): string | undefined {
        return process.env.TRADE_POSITION_RANGE;
    }

    static getTickInterval(): string | undefined {
        return process.env.TICK_INTERVAL;
    }

    static getBotToken(): string | undefined {
        return process.env.BOT_TOKEN;
    }

    static getChatId(): string | undefined {
        return process.env.CHAT_ID;
    }

    static getTimeFrame(): string | undefined {
        return process.env.TIME_FRAME;
    }
}