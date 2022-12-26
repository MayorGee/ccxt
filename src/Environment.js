import dotenv from 'dotenv';
dotenv.config();

export default class Environment {
    static getApiKey() {
        return process.env.API_KEY;
    }

    static getApiSecretKey() {
        return process.env.API_SECRET_KEY;
    }

    static getAsset() {
        return process.env.ASSET;
    }

    static getBase() {
        return process.env.BASE;
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
}