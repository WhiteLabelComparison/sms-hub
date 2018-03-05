"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var database_1 = require("../../database");
var validation_1 = require("../validation");
var SendController = (function () {
    function SendController() {
    }
    SendController.email = function (req, res, supplier) {
        var _this = this;
        var errors = validation_1.Validation.checkFieldsIn(req.body, ['message', 'subject', 'from', 'to']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors: errors });
            return;
        }
        log_1.Log.debug("Sending email to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);
        supplier.sendMessage(req.body.from, req.body.to, req.body.subject, req.body.message).then(function (response) {
            log_1.Log.debug("Email sent to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);
            _this.saveMail(req.body.to, req.body.from, req.body.subject, req.body.message, 1)
                .then(function (messageId) {
                log_1.Log.debug("Email to " + req.body.to + " from " + req.body.from + " saved to conversation");
                res.json({ success: true, messageCount: 1 });
            })
                .catch(function (error) {
                log_1.Log.error("Error sending message, '" + error.message + "'");
                res.json({ success: false, errors: error });
            });
        })
            .catch(function (error) {
            log_1.Log.error("Error sending message, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    SendController.message = function (req, res, supplier) {
        var _this = this;
        var errors = validation_1.Validation.checkFieldsIn(req.body, ['message', 'from', 'to']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors: errors });
            return;
        }
        log_1.Log.debug("Sending message to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);
        supplier.sendMessage(req.body.from, req.body.to, req.body.message)
            .then(function (response) {
            log_1.Log.debug("Message sent to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);
            _this.saveMessage(req.body.to, req.body.from, req.body.message, response)
                .then(function (messageId) {
                log_1.Log.debug("Message to " + req.body.to + " from " + req.body.from + " saved to conversation");
                res.json({ success: true, messageCount: response });
            })
                .catch(function (error) {
                log_1.Log.error("Error sending message, '" + error.message + "'");
                res.json({ success: false, errors: error });
            });
        })
            .catch(function (error) {
            log_1.Log.error("Error sending message, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    SendController.saveMail = function (to, from, subject, message, count) {
        log_1.Log.debug("Saving email to " + to + " from " + from);
        var db = new database_1.Database().db;
        return db.one("INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count) VALUES('email', $[from], $[to], $[subject], $[message], $[count]) RETURNING id", {
            to: to,
            from: from,
            subject: subject,
            message: message,
            count: count
        });
    };
    SendController.saveMessage = function (to, from, message, count) {
        log_1.Log.debug("Saving message to " + to + " from " + from);
        var db = new database_1.Database().db;
        return db.one("INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count) VALUES('message',$[from], $[to], $[message], $[count]) RETURNING id", {
            to: to,
            from: from,
            message: message,
            count: count
        });
    };
    return SendController;
}());
exports.SendController = SendController;
//# sourceMappingURL=send.controller.js.map