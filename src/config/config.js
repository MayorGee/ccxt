import Environment from '../Environment.js';

export const config = {
    asset: Environment.getAsset(),
    base: Environment.getBase(),
    allocation: Environment.getAllocation(),
    spread: Environment.getSpread(),
    tickInterval: Environment.getTickInterval()
};