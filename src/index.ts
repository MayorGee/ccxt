import Trader from './models/Trader.js';
import { MOVING_AVERAGE_COMMAND_OPTIONS, SWING_COMMAND_OPTIONS } from './store/options.js';
import MarketMakingTrader from './strategies/MarketMakingTrader.js';
import MovingAverageTrader from './strategies/MovingAverageTrader.js';
import SwingTrader from './strategies/SwingTrader.js';

const trader = new Trader();
trader.initBot();

const telegram = trader.telegram;

telegram.setOnText(/\/swing/, () => {
    const swingTrader = new SwingTrader();
    swingTrader.prepareSwingExtremes();
    swingTrader.execute();

    // telegram.sendMessage({ 
    //     message: `Swing Strategy Selected! \nSelect from the options below to proceed`,
    //     basicOptions: SWING_COMMAND_OPTIONS
    // });
}); 

telegram.setOnText(/\/movingAverage/, () => {
    const movingAverageTrader = new MovingAverageTrader();
    movingAverageTrader.execute();

    // telegram.sendMessage({ 
    //     message: `Moving Average Strategy Selected! \nSelect from the options below to proceed`,
    //     basicOptions: MOVING_AVERAGE_COMMAND_OPTIONS
    // });
});

telegram.setOnText(/\/marketMaker/, () => {
    const marketMaker = new MarketMakingTrader();
    marketMaker.execute();
});