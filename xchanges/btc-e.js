'use strict';

const apiLookups = [
    'https://btc-e.com/api/3/ticker/ltc_btc', 
    'https://btc-e.com/api/3/ticker/eth_btc', 
    'https://btc-e.com/api/3/ticker/dsh_btc'
]

module.exports = {
    sendRequest: function (request, reqTimeInUtc, ExchangeRecord) {
        async function main() {
            let responseValues = [];
            let count = 0;
            let apiUrls = apiLookups.map(async function (theUrl) {
                let pushbackObject = {};
                await request(theUrl, function (error, response, body) {
                    if (!error) {
                        let info = JSON.parse(body)
                        if (Object.keys(info)[0] === 'eth_btc') {
                            pushbackObject = {
                                currency: 'BTC-ETH',
                                highBid: info.eth_btc.high,
                                lowAsk: info.eth_btc.low
                            }
                        }
                        if (Object.keys(info)[0] === 'dsh_btc') {
                            pushbackObject = {
                                currency: 'BTC-DSH',
                                highBid: info.dsh_btc.high,
                                lowAsk: info.dsh_btc.low
                            }
                        }
                        if (Object.keys(info)[0] === 'ltc_btc') {
                            pushbackObject = {
                                currency: 'BTC-LTC',
                                highBid: info.ltc_btc.high,
                                lowAsk: info.ltc_btc.low
                            }
                        }
                        count = count + 1;
                    }
                    responseValues.push(pushbackObject)
                })
            })
            await Promise.all(apiUrls).then(() => {
                let dataRecord = new ExchangeRecord({ exchange: 'btc-e', values: responseValues, timeRecorded: reqTimeInUtc })
                dataRecord.save(function (err) {
                    if (err) return handleError(err);
                })
            })
        }
        main()
    }
};