import { config } from '../config/config.js';

export default class Position {
    static tradePositionRange = Number(config.tradePositionRange);
    static buy: number[] = [];
    static sell: number[] = [];

    static prepareBuyPositions(lowerLimit: number, upperLimit: number) {
        const buyRange = (upperLimit - lowerLimit) / this.tradePositionRange;
        
        for(let i = 0; i < this.tradePositionRange; i++) {
            upperLimit = upperLimit - buyRange;
            this.buy.push(upperLimit);
        }
    }

    static getBuyPositions(): number[] {
        return this.buy;
    }

    static setBuyPositions(buyPositions: number[]) {
        this.buy = buyPositions;
    }

    static setSellPositions(sellPositions: number[]) {
        this.sell = sellPositions;
    }
}