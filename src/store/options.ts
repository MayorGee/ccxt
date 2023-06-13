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
            ],
            [
                {
                    text: '/orders'
                },
                {
                    text: '/balance'
                },
                {
                    text: '/performance'
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
                    text: '/swing'
                },
                {
                    text: '/movingAverage'
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