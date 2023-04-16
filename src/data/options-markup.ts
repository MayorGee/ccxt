export const START_COMMAND_OPTIONS = {
    reply_markup: {
        'keyboard': [
            [
                {
                    text: '/setRange'
                },                                        
                {
                    text: '/trade'
                }
            ],   
            [
                {
                    text: '/performance'
                }
            ],
            [
                {
                    text: '/table'
                },
                {
                    text: '/balance'
                },
                {
                    text: '/blyat'
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