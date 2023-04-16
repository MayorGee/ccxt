import { getFibRetracement, levels } from 'fib-retracement';
import { SMA } from 'technicalindicators';
import { IFibonacci } from '../abstracts/interfaces';

export default class Indicator {
    // https://www.npmjs.com/package/technicalindicators

    getFibonacciRetracement(start: number, end: number): IFibonacci {
        /*
            if start is 0 and end is 10:
                getFibRetracement = {
                    1: 0
                    0.786: 2.1399999999999997,
                    0.618: 3.8200000000000003,
                    0.5: 5,
                    0.382: 6.18,
                    0.236: 7.640000000000001,
                    0: 10,
                }
        */

        return getFibRetracement(start, end);         
    }

    getFibonacciLevels(): number[] {
        // levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

        return levels; 
    }

    getSimpleMovingAverages(period: number, values: number[]): number[] {
        return SMA.calculate({ period, values });
    }
}