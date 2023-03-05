import Environment from '../Environment.js';

export const config = {
    assetTicker: Environment.getAssetTicker() as string,
    assetName : Environment.getAssetName() as string,

    baseTicker: Environment.getBaseTicker() as string,
    baseName : Environment.getBaseName() as string,
    
    allocation: Environment.getAllocation() as string,
    spread: Environment.getSpread() as string,
    tickInterval: Environment.getTickInterval() as string
};