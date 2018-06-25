"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require("aws-sdk");
const config_1 = require("../../config");
const database_1 = require("../../database");
const log_1 = require("../log");
const request_1 = require("../request");
class ReceiveController {
    static mail(req, res, supplier) {
        log_1.Log.debug('Inbound Email detected');
        const receivedMessage = supplier.receive(req.body);
        if (!receivedMessage) {
            res.json({ success: true });
            return;
        }
        this.saveEmail(receivedMessage.to, receivedMessage.from, receivedMessage.subject, receivedMessage.message, receivedMessage.timestamp, receivedMessage.attachments)
            .then(messageId => res.json({ success: true, message: 'Email has been saved.' }))
            .then(() => {
            const db = new database_1.Database().db;
            db.one(`
        SELECT
        CASE
        WHEN
                COUNT((SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)) > 0
        THEN
                (SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)
        ELSE
                NULL
        END AS url
      `, {
                to: receivedMessage.to,
            })
                .then(result => {
                if (result.url && result.url !== null) {
                    request_1.Request.post(result.url + '/email', {
                        to: receivedMessage.to,
                        from: receivedMessage.from,
                    });
                }
            });
        })
            .catch(error => {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static message(req, res, supplier) {
        const errors = [];
        log_1.Log.debug('Inbound message detected');
        const receivedMessage = supplier.receive(req.query);
        this.saveMessage(receivedMessage.to, receivedMessage.from, receivedMessage.message, receivedMessage.timestamp)
            .then(messageId => res.json({ success: true, message: 'Message has been saved.' }))
            .then(() => {
            const db = new database_1.Database().db;
            db.one(`
        SELECT
        CASE
        WHEN
                COUNT((SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)) > 0
        THEN
                (SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)
        ELSE
                NULL
        END AS url
      `, {
                to: receivedMessage.to,
            })
                .then(result => {
                if (result.url && result.url !== null) {
                    request_1.Request.post(result.url + '/email', {
                        to: receivedMessage.to,
                        from: receivedMessage.from,
                    });
                }
            });
        })
            .catch(error => {
            log_1.Log.error('Error sending message, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static saveEmail(to, from, subject, message, timestamp, attachments) {
        log_1.Log.debug('Saving message to ' + to + ' from ' + from);
        const db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count, created_at) VALUES(\'email\',$[from], $[to], $[subject], $[message], 0, NOW()) RETURNING id', {
            to,
            from,
            subject,
            message,
            timestamp,
        }).then(result => {
            if (attachments) {
                log_1.Log.debug('Email has attachments');
                aws.config.update({ accessKeyId: config_1.Config.aws.key, secretAccessKey: config_1.Config.aws.secret, signatureVersion: 'v4' });
                const s3Client = new aws.S3();
                const date = new Date;
                const dateStr = [
                    [date.getFullYear().toString(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join(''),
                    [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2), ('0' + date.getSeconds()).slice(-2)].join(''),
                ].join('/');
                for (const file of attachments) {
                    const remotePath = 'emails/' + from + '/' + dateStr + '-' + file.filename;
                    s3Client.putObject({
                        Bucket: config_1.Config.bucket,
                        Key: remotePath,
                        Body: file.content,
                        ACL: 'public-read',
                    }, (err, data) => {
                        if (err) {
                            log_1.Log.error('filed to upload ' + file.filename);
                            return;
                        }
                        db.none('INSERT INTO conversation_attachments (conversation_id, filename, url) VALUES (${conversation_id}, ${filename}, ${url})', {
                            conversation_id: result.id,
                            filename: file.filename,
                            url: 'https://s3.eu-west-2.amazonaws.com/'.concat(config_1.Config.bucket, '/', remotePath),
                        }).then(() => {
                        })
                            .catch((err) => log_1.Log.error('Failed to insert attachment'));
                    });
                }
            }
        });
    }
    static saveMessage(to, from, message, timestamp) {
        log_1.Log.debug('Saving message to ' + to + ' from ' + from);
        const db = new database_1.Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count, created_at) VALUES(\'message\',$[from], $[to], $[message], 0, $[timestamp]) RETURNING id', {
            to,
            from,
            message,
            timestamp,
        });
    }
}
exports.ReceiveController = ReceiveController;
//# sourceMappingURL=receive.controller.js.map