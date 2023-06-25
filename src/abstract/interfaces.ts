import { OrderSide } from './enum';

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
    volume: number,
    movingAverageDecision?: OrderSide.buy | OrderSide.sell
}

export interface BuyPosition {
    price: number,
    volume: number
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
    execute(): void
}