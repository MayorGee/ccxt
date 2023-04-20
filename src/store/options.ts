export const START_COMMAND_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/buy'
                },
                {
                    text: '/showRSI'
                },                                        
                {
                    text: '/sell'
                }
            ],   
            [
                {
                    text: '/showSwingEndPoints'
                },
                {
                    text: '/showMarketPrice'
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