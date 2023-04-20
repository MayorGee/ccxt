import OhlcvModel from './models/OhlcvModel.js';
import Trader from './models/Trader.js';

OhlcvModel.prepareSwingExtremes();

const trader = new Trader();
trader.init();