import Environment from '../Environment.js';

export const config = {
    assetTicker: Environment.getAssetTicker(),
    assetName : Environment.getAssetName(),

    baseTicker: Environment.getBaseTicker(),
    baseName : Environment.getBaseName(),
    
    allocation: Environment.getAllocation(),
    spread: Environment.getSpread(),
    tickInterval: Environment.getTickInterval()
};