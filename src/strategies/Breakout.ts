import { OrderSide } from '../abstract/enum.js';
import { IStrategy, Ohlcv } from '../abstract/interfaces.js';
import Binance from '../models/Binance.js';
import OhlcvModel from '../models/OhlcvModel.js';
import Telegram from '../models/Telegram.js';

export default class Breakout implements IStrategy {
    private telegram: Telegram;
    private binance: Binance;
    private supportLevel = 0;
    private position = OrderSide.hold;
    private symbol = 'DOT/USDT';
    private timeFrame = '30m';
    private resistanceLevel = 0;
    private lookBackPeriod = 400;

    constructor(
        telegram: Telegram, 
        binance: Binance
    ){
        this.telegram = telegram;
        this.binance = binance;
    }

    public initTelegram() {
        this.telegram.setOnText(/\/findBreakoutEntry/, this.findEntryPoint.bind(this));
    }

    private findEntryPoint() {
        try {
            this.telegram.sendMessage({
                message: 'Searching For Breakout Entry Points...'
            });
    
            setInterval(async () => {
                await this.triggerOrderSignal();
            }, 2000);
        } catch (error: any) {
            this.telegram.sendMessage({
                message: `Something went wrong. ${error.message}`
            }); 
        }
    }

    private async triggerOrderSignal() {
        const candles = await OhlcvModel.getData(this.symbol, this.timeFrame) as Ohlcv[];
        const closePrices = candles.map((candle) => candle.close);

        this.setSupportLevel(closePrices);
        this.setResistanceLevel(closePrices);

        // generate buy/sell signals based on the price position relative to the bands
        this.determineOrderSide(closePrices);
    }

    private determineOrderSide(closePrices: number[]) {
        closePrices.forEach(closePrice => {
            if (closePrice > this.resistanceLevel) {
                this.position = OrderSide.buy;

                this.telegram.sendMessage({
                    message: `Buy signal found at ${closePrice}`
                });
            } else if (closePrice < this.supportLevel) {
                this.position = OrderSide.sell;

                this.telegram.sendMessage({
                    message: `Sell signal found at ${closePrice}`
                });
            } else {
                this.position = OrderSide.hold;
            }
        });
    }

    private setSupportLevel(closePrices: number[]) {
        this.supportLevel = Math.min(...closePrices.slice(-this.lookBackPeriod));
    }

    private setResistanceLevel(closePrices: number[]) {
        this.supportLevel = Math.max(...closePrices.slice(-this.lookBackPeriod));
    }
}