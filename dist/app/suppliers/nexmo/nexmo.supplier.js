"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../request");
var config_1 = require("../../../config");
var NexmoSupplier = (function () {
    function NexmoSupplier() {
    }
    NexmoSupplier.prototype.assignNumber = function (webhook) {
        return new Promise(function (res, rej) {
            request_1.Request.get('https://rest.nexmo.com/number/search', { api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret, country: 'GB', features: 'SMS,VOICE', size: 1 })
                .then(function (result) {
                var chosenNumber = JSON.parse(result.body).numbers[0].msisdn;
                request_1.Request.post('https://rest.nexmo.com/number/buy', { api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret, country: 'GB', msisdn: chosenNumber })
                    .then(function (result) {
                    request_1.Request.post('https://rest.nexmo.com/number/update', { api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret, country: 'GB', msisdn: chosenNumber, moHttpUrl: webhook + "/receive/message/" + chosenNumber })
                        .then(function (result) { return res(chosenNumber); })
                        .catch(function (err) { return rej(err); });
                })
                    .catch(function (err) {
                    rej(err);
                });
            })
                .catch(function (err) {
                rej(err);
            });
        });
    };
    NexmoSupplier.prototype.sendMessage = function (from, to, message) {
        return new Promise(function (res, rej) {
            request_1.Request.post('https://rest.nexmo.com/sms/json', {
                api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret,
                from: from, to: to,
                text: message
            })
                .then(function (result) {
                res(JSON.parse(result.body)['message-count']);
            })
                .catch(function (err) { return rej(err); });
        });
    };
    NexmoSupplier.prototype.receive = function (request) {
        return {
            to: request.to,
            from: request.msisdn,
            message: request.text,
            timestamp: request['message-timestamp']
        };
    };
    NexmoSupplier.prototype.deleteNumber = function (number) {
        return new Promise(function (res, rej) {
            request_1.Request.post('https://rest.nexmo.com/number/cancel', {
                api_key: config_1.Config.nexmo.key, api_secret: config_1.Config.nexmo.secret,
                country: 'GB', msisdn: number
            })
                .then(function (result) {
                return true;
            })
                .catch(function (err) { return rej(err); });
        });
    };
    return NexmoSupplier;
}());
exports.NexmoSupplier = NexmoSupplier;
//# sourceMappingURL=nexmo.supplier.js.map