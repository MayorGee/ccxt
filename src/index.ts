import Binance from './models/Binance.js';
import Trader from './models/Trader.js';

import MarketMaking from './strategies/MarketMaking.js';
import MovingAverageCrossOver from './strategies/MovingAverageCrossOver.js';
import Swing from './strategies/Swing.js';
import MeanReversion from './strategies/MeanReversion.js';
import BollingerBands from './strategies/BollingerBands.js';
import Breakout from './strategies/Breakout.js';
import Arbitrage from './strategies/Arbitrage.js';
import Momentum from './strategies/Momentum.js';

import { 
    MOVING_AVERAGE_COMMAND_OPTIONS, 
    SWING_COMMAND_OPTIONS 
} from './store/options.js';

const binance = new Binance();
const trader = new Trader();
trader.initBot();

const telegram = trader.telegram;

telegram.setOnText(/\/marketMaker/, () => {
    const marketMaker = new MarketMaking(telegram, binance);
    marketMaker.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Making Market!`
    });
});

telegram.setOnText(/\/movingAverage/, () => {
    const movingAverageTrader = new MovingAverageCrossOver(telegram);
    movingAverageTrader.initTelegram();

    telegram.sendMessage({ 
        message: `Moving Average Strategy Selected! \nSelect from the options below to proceed`,
        basicOptions: MOVING_AVERAGE_COMMAND_OPTIONS
    });
});

telegram.setOnText(/\/swing/, () => {
    const swingTrader = new Swing(telegram, binance);
    swingTrader.prepareSwingExtremes();
    swingTrader.initTelegram();

    telegram.sendMessage({ 
        message: `Swing Strategy Selected! \nSelect from the options below to proceed`,
        basicOptions: SWING_COMMAND_OPTIONS
    });
}); 

telegram.setOnText(/\/meanReversion/, () => {
    const meanReversionTrader = new MeanReversion(telegram, binance);
    meanReversionTrader.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Mean Reversion Strategy!`
    });
});

telegram.setOnText(/\/bollingerBands/, () => {
    const bollingerBands = new BollingerBands(telegram, binance);
    bollingerBands.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Bollinger Bands Strategy!`
    });
});

telegram.setOnText(/\/breakout/, () => {
    const breakout = new Breakout(telegram, binance);
    breakout.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Breakout Strategy!`
    });
});

telegram.setOnText(/\/arbitrage/, () => {
    const arbitrage = new Arbitrage(telegram, binance);
    arbitrage.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Arbitrage Strategy!`
    });
});

telegram.setOnText(/\/momentum/, () => {
    const momentum = new Momentum(telegram, binance);
    momentum.initTelegram();

    telegram.sendMessage({ 
        message: `Proceeding to Momentum Strategy!`
    });
});