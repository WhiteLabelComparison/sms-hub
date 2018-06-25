"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../../request");
const config_1 = require("../../../config");
class NexmoSupplier {
    assignNumber(webhook) {
        return new Promise((res, rej) => {
            request_1.Request.get('https://rest.nexmo.com/number/search', {
                api_key: config_1.Config.nexmo.key,
                api_secret: config_1.Config.nexmo.secret,
                country: 'GB',
                features: 'SMS,VOICE',
                size: 1,
            })
                .then(result => {
                let chosenNumber = JSON.parse(result.body).numbers[0].msisdn;
                request_1.Request.post('https://rest.nexmo.com/number/buy', {
                    api_key: config_1.Config.nexmo.key,
                    api_secret: config_1.Config.nexmo.secret,
                    country: 'GB',
                    msisdn: chosenNumber,
                })
                    .then(result => {
                    request_1.Request.post('https://rest.nexmo.com/number/update', {
                        api_key: config_1.Config.nexmo.key,
                        api_secret: config_1.Config.nexmo.secret,
                        country: 'GB',
                        msisdn: chosenNumber,
                        moHttpUrl: webhook + '/receive/message/' + chosenNumber,
                    })
                        .then(result => res(chosenNumber))
                        .catch(err => rej(err));
                })
                    .catch(err => {
                    rej(err);
                });
            })
                .catch(err => {
                rej(err);
            });
        });
    }
    sendMessage(from, to, message) {
        return new Promise((res, rej) => {
            request_1.Request.post('https://rest.nexmo.com/sms/json', {
                api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret,
                from: from, to: to,
                text: message,
            })
                .then(result => {
                res(JSON.parse(result.body)['message-count']);
            })
                .catch(err => rej(err));
        });
    }
    receive(request) {
        return {
            to: request.to,
            from: request.msisdn,
            message: request.text,
            timestamp: request['message-timestamp'],
        };
    }
    deleteNumber(number) {
        return new Promise((res, rej) => {
            request_1.Request.post('https://rest.nexmo.com/number/cancel', {
                api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret,
                country: 'GB', msisdn: number,
            })
                .then(result => {
                res(true);
            })
                .catch(err => rej(err));
        });
    }
}
exports.NexmoSupplier = NexmoSupplier;
//# sourceMappingURL=nexmo.supplier.js.map