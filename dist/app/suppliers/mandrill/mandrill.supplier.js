"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../../config");
var request_1 = require("../../request");
var MandrillSupplier = (function () {
    function MandrillSupplier() {
    }
    MandrillSupplier.prototype.assignInbound = function (webhook, domain) {
        return new Promise(function (res, rej) {
            request_1.Request.post('https://mandrillapp.com/api/1.0/inbound/add-domain.json', {
                'key': config_1.Config.mandrill.key,
                'domain': domain
            })
                .then(function (response) {
                console.log({
                    'key': config_1.Config.mandrill.key,
                    'domain': domain,
                    'pattern': '*',
                    'url': webhook + '/receive/email/' + domain
                });
                request_1.Request.post('https://mandrillapp.com/api/1.0/inbound/add-route.json', {
                    'key': config_1.Config.mandrill.key,
                    'domain': domain,
                    'pattern': '*',
                    'url': webhook + '/receive/email'
                })
                    .then(function (response) {
                    res(response);
                })
                    .catch(function (error) { return rej(error); });
            })
                .catch(function (error) { return rej(error); });
        });
    };
    MandrillSupplier.prototype.sendMessage = function (from, to, subject, message) {
        return new Promise(function (res, rej) {
            request_1.Request.post('http://mandrillapp.com/api/1.0/messages/send.json', {
                key: config_1.Config.mandrill.key,
                message: {
                    html: message,
                    subject: subject,
                    from_email: from,
                    to: [{ email: to }]
                }
            })
                .then(function (response) { return res(response); })
                .catch(function (error) { return rej(error); });
        });
    };
    MandrillSupplier.prototype.receive = function (request) {
        var attachments = [];
        var mandrillEvent = JSON.parse(request.mandrill_events);
        if (mandrillEvent[0] === undefined) {
            return null;
        }
        var mailMessage = mandrillEvent[0].msg;
        if (mailMessage.attachments) {
            for (var i in mailMessage.attachments) {
                attachments.push({
                    'filename': mailMessage.attachments[i].name,
                    'content': mailMessage.attachments[i].base64 ? Buffer.from(mailMessage.attachments[i].content.toString(), 'base64') : mailMessage.attachments[i].content
                });
            }
        }
        if (mailMessage.images) {
            for (var i in mailMessage.images) {
                attachments.push({
                    'filename': mailMessage.images[i].name,
                    'content': mailMessage.images[i].content
                });
            }
        }
        return {
            'to': mailMessage.email,
            'from': mailMessage.from_email,
            'subject': mailMessage.subject,
            'message': mailMessage.html ? mailMessage.html : mailMessage.text,
            'attachments': attachments
        };
    };
    MandrillSupplier.prototype.deleteInbound = function (number) {
        throw new Error('Method not implemented.');
    };
    return MandrillSupplier;
}());
exports.MandrillSupplier = MandrillSupplier;
//# sourceMappingURL=mandrill.supplier.js.map