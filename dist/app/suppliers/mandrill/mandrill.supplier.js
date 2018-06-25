"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
const request_1 = require("../../request");
class MandrillSupplier {
    assignInbound(webhook, domain) {
        return new Promise((res, rej) => {
            request_1.Request.post('https://mandrillapp.com/api/1.0/inbound/add-domain.json', {
                key: config_1.Config.mandrill.key,
                domain,
            })
                .then(response => {
                console.log({
                    key: config_1.Config.mandrill.key,
                    domain,
                    pattern: '*',
                    url: webhook + '/receive/email/' + domain,
                });
                request_1.Request.post('https://mandrillapp.com/api/1.0/inbound/add-route.json', {
                    key: config_1.Config.mandrill.key,
                    domain,
                    pattern: '*',
                    url: webhook + '/receive/email',
                })
                    .then(response => {
                    res(response);
                })
                    .catch(error => rej(error));
            })
                .catch(error => rej(error));
        });
    }
    sendMessage(from, to, subject, message, attachments = []) {
        return new Promise((res, rej) => {
            request_1.Request.post('http://mandrillapp.com/api/1.0/messages/send.json', {
                key: config_1.Config.mandrill.key,
                message: {
                    html: message,
                    text: message.replace('<br/>', '\n'),
                    subject,
                    from_email: from,
                    to: [{ email: to }],
                    attachments,
                },
            })
                .then(response => res(response))
                .catch(error => rej(error));
        });
    }
    receive(request) {
        const attachments = [];
        const mandrillEvent = JSON.parse(request.mandrill_events);
        if (mandrillEvent[0] === undefined) {
            return null;
        }
        const mailMessage = mandrillEvent[0].msg;
        if (mailMessage.attachments) {
            for (const i in mailMessage.attachments) {
                attachments.push({
                    filename: mailMessage.attachments[i].name,
                    content: mailMessage.attachments[i].base64 ? Buffer.from(mailMessage.attachments[i].content.toString(), 'base64') : mailMessage.attachments[i].content,
                });
            }
        }
        if (mailMessage.images) {
            for (const i in mailMessage.images) {
                attachments.push({
                    filename: mailMessage.images[i].name,
                    content: mailMessage.images[i].content,
                });
            }
        }
        return {
            to: mailMessage.email,
            from: mailMessage.from_email,
            subject: mailMessage.subject,
            message: mailMessage.html ? mailMessage.html : mailMessage.text,
            attachments,
        };
    }
    deleteInbound(number) {
        throw new Error('Method not implemented.');
    }
}
exports.MandrillSupplier = MandrillSupplier;
//# sourceMappingURL=mandrill.supplier.js.map