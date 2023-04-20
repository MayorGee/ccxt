import Environment from '../Environment.js';

export const config = {
    assetTicker: Environment.getAssetTicker() as string,
    assetName : Environment.getAssetName() as string,

    baseTicker: Environment.getBaseTicker() as string,
    baseName : Environment.getBaseName() as string,
    
    allocation: Environment.getAllocation() as string,
    stopLoss: Environment.getStopLoss() as string,
    tickInterval: Environment.getTickInterval() as string,
    tradePositionRange: Environment.getTradePositionRange() as string,
    timeFrame: Environment.getTimeFrame() as string
};