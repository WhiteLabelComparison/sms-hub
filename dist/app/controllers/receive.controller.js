"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws = require("aws-sdk");
var config_1 = require("../../config");
var database_1 = require("../../database");
var log_1 = require("../log");
var ReceiveController = (function () {
    function ReceiveController() {
    }
    ReceiveController.mail = function (req, res, supplier) {
        log_1.Log.debug('Inbound Email detected');
        var receivedMessage = supplier.receive(req.body);
        if (!receivedMessage) {
            res.json({ success: true });
            return;
        }
        this.saveEmail(receivedMessage.to, receivedMessage.from, receivedMessage.subject, receivedMessage.message, receivedMessage.timestamp, receivedMessage.attachments)
            .then(function (messageId) { return res.json({ success: true, message: 'Email has been saved.' }); })
            .catch(function (error) {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    };
    ;
    ReceiveController.message = function (req, res, supplier) {
        var errors = [];
        log_1.Log.debug('Inbound message detected');
        var receivedMessage = supplier.receive(req.query);
        this.saveMessage(receivedMessage.to, receivedMessage.from, receivedMessage.message, receivedMessage.timestamp)
            .then(function (messageId) { return res.json({ success: true, message: 'Message has been saved.' }); })
            .catch(function (error) {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    };
    ReceiveController.saveEmail = function (to, from, subject, message, timestamp, attachments) {
        log_1.Log.debug('Saving message to ' + to + ' from ' + from);
        var db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count, created_at) VALUES(\'email\',$[from], $[to], $[subject], $[message], 0, NOW()) RETURNING id', {
            to: to,
            from: from,
            subject: subject,
            message: message,
            timestamp: timestamp
        }).then(function (result) {
            if (attachments) {
                log_1.Log.debug('Email has attachments');
                aws.config.update({ accessKeyId: config_1.Config.aws.key, secretAccessKey: config_1.Config.aws.secret, signatureVersion: 'v4' });
                var s3Client = new aws.S3();
                var date = new Date;
                var dateStr = [
                    [date.getFullYear().toString(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join(''),
                    [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2), ('0' + date.getSeconds()).slice(-2)].join('')
                ].join('/');
                var _loop_1 = function (file) {
                    var remotePath = 'emails/' + from + '/' + dateStr + '-' + file.filename;
                    s3Client.putObject({
                        Bucket: config_1.Config.bucket,
                        Key: remotePath,
                        Body: file.content,
                        ACL: 'public-read'
                    }, function (err, data) {
                        if (err) {
                            log_1.Log.error('filed to upload ' + file.filename);
                            return;
                        }
                        db.none('INSERT INTO conversation_attachments (conversation_id, filename, url) VALUES (${conversation_id}, ${filename}, ${url})', {
                            'conversation_id': result.id,
                            'filename': file.filename,
                            'url': 'https://s3.eu-west-2.amazonaws.com/'.concat(config_1.Config.bucket, '/', remotePath)
                        }).then(function () {
                        })
                            .catch(function (err) { return log_1.Log.error('Failed to insert attachment'); });
                    });
                };
                for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
                    var file = attachments_1[_i];
                    _loop_1(file);
                }
            }
        });
    };
    ReceiveController.saveMessage = function (to, from, message, timestamp) {
        log_1.Log.debug('Saving message to ' + to + ' from ' + from);
        var db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count, created_at) VALUES(\'message\',$[from], $[to], $[message], 0, $[timestamp]) RETURNING id', {
            to: to,
            from: from,
            message: message,
            timestamp: timestamp
        });
    };
    return ReceiveController;
}());
exports.ReceiveController = ReceiveController;
//# sourceMappingURL=receive.controller.js.map