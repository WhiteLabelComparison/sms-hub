"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const database_1 = require("../../database");
const validation_1 = require("../validation");
class SendController {
    static email(req, res, supplier) {
        const errors = validation_1.Validation.checkFieldsIn(req.body, ['message', 'subject', 'from', 'to']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors });
            return;
        }
        log_1.Log.debug('Sending email to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
        supplier.sendMessage(req.body.from, req.body.to, req.body.subject, req.body.message, req.body.attachments).then(response => {
            log_1.Log.debug('Email sent to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
            this.saveMail(req.body.to, req.body.from, req.body.subject, req.body.message, 1)
                .then(messageId => {
                log_1.Log.debug('Email to ' + req.body.to + ' from ' + req.body.from + ' saved to conversation');
                res.json({ success: true, messageCount: 1 });
            })
                .catch(error => {
                log_1.Log.error('Error sending message, \'' + error.message + '\'');
                res.json({ success: false, errors: error });
            });
        })
            .catch(error => {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static message(req, res, supplier) {
        const errors = validation_1.Validation.checkFieldsIn(req.body, ['message', 'from', 'to']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors });
            return;
        }
        log_1.Log.debug('Sending message to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
        supplier.sendMessage(req.body.from, req.body.to, req.body.message)
            .then(response => {
            log_1.Log.debug('Message sent to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
            this.saveMessage(req.body.to, req.body.from, req.body.message, response)
                .then(messageId => {
                log_1.Log.debug('Message to ' + req.body.to + ' from ' + req.body.from + ' saved to conversation');
                res.json({ success: true, messageCount: response });
            })
                .catch(error => {
                log_1.Log.error('Error sending message, \'' + error.message + '\'');
                res.json({ success: false, errors: error });
            });
        })
            .catch(error => {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static saveMail(to, from, subject, message, count) {
        log_1.Log.debug('Saving email to ' + to + ' from ' + from);
        const db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count) VALUES(\'email\', $[from], $[to], $[subject], $[message], $[count]) RETURNING id', {
            to,
            from,
            subject,
            message,
            count,
        });
    }
    static saveMessage(to, from, message, count) {
        log_1.Log.debug('Saving message to ' + to + ' from ' + from);
        const db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count) VALUES(\'message\',$[from], $[to], $[message], $[count]) RETURNING id', {
            to,
            from,
            message,
            count,
        });
    }
}
exports.SendController = SendController;
//# sourceMappingURL=send.controller.js.map