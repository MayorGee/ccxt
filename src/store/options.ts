export const SWING_COMMAND_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/buySwing'
                },                                       
                {
                    text: '/sellSwing'
                }
            ],   
            [
                {
                    text: '/showSwingEndPoints'
                }
            ]
        ]
    }
};

export const ARBITRAGE_COMMAND_OPTIONS ={
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/checkArbitrageOpportunity'
                }
            ],   
            [
                {
                    text: '/emptyCommand'
                }
            ]
        ]
    }
};

export const MOVING_AVERAGE_COMMAND_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/searchForEntryPoint'
                },                                       
                {
                    text: '/emptyCommand'
                }
            ]
        ]
    }
};

export const START_COMMAND_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/chooseStrategy'
                
                }
            ],
            [
                {
                    text: '/showRSI'
                },
            ]
        ]
    }
};

export const STRATEGY_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/breakout'
                },
                {
                    text: '/marketMaker'
                },
                {
                    text: '/momentum'
                }
            ],
            [
                {
                    text: '/arbitrage'
                },
                {
                    text: '/bollingerBands'
                }
            ],
            [
                {
                    text: '/meanReversion'
                },
                {
                    text: '/swing'
                },
                {
                    text: '/movingAverage'
                }                
            ]
        ]
    }
};

export const SET_RANGE_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/setBuyRange'
                },                                        
                {
                    text: '/setSellRange'
                }
            ]
        ]
    }
};

export const SET_RANGE_REPLY = {
    reply_markup: {
        force_reply: true
    }
}