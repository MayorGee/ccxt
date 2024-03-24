import Telegram from '../models/Telegram.js';
import { OrderSide } from './enum.js';

export interface IFibonacci {
    1: number
    0.786: number,
    0.618: number,
    0.5: number,
    0.382: number,
    0.236: number,
    0: number,
}

export interface Ohlcv {
    time: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
}

export interface BuyPosition {
    price: number,
    volume: number
}

export interface BollingerBand {
    upperBand: number,
    lowerBand: number
}

export interface TelegramMessage {
    chatId?: string | number, 
    message: string, 
    basicOptions?: Object
}

export interface SwingLowHigh {
    lowestLow: number;
    highestHigh: number;
}

export interface IStrategy {
    initTelegram(telegram: Telegram): void
}

export interface ExchangeRank {
    exchangeName: string,
    buySpread: number,
    sellSpread: number
}