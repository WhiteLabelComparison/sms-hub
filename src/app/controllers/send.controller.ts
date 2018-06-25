import {Log} from '../log';
import {Database} from '../../database';
import {SmsSupplier} from '../suppliers/sms-supplier';
import {EmailSupplier} from '../suppliers/email-supplier';
import {Validation} from '../validation';

export class SendController {

    static email(req, res, supplier: EmailSupplier) {
        const errors: string[]|boolean = Validation.checkFieldsIn(req.body, ['message', 'subject', 'from', 'to']);

        if (errors) {
            res.status(400);
            res.json({success: false, errors});
            return;
        }

        // @todo store attachments against conversation
        Log.debug('Sending email to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
        supplier.sendMessage(
            req.body.from,
            req.body.to,
            req.body.subject,
            req.body.message,
            req.body.attachments,
        ).then(response => {
            Log.debug('Email sent to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
            this.saveMail(req.body.to, req.body.from, req.body.subject, req.body.message, 1)
                .then(messageId => {
                    Log.debug('Email to ' + req.body.to + ' from ' + req.body.from + ' saved to conversation');
                    res.json({success: true, messageCount: 1});
                })
                .catch(error => {
                    Log.error('Error sending message, \'' + error.message + '\'');
                    res.json({success: false, errors: error});
                });
        })
        .catch(error => {
            Log.error('Error sending message, \'' + error.message + '\'');
            res.json({success: false, errors: error});
        });
    }

    static message(req, res, supplier: SmsSupplier) {
        const errors: string[]|boolean = Validation.checkFieldsIn(req.body, ['message', 'from', 'to']);

        if (errors) {
            res.status(400);
            res.json({success: false, errors});
            return;
        }

        Log.debug('Sending message to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));
        supplier.sendMessage(
                req.body.from,
                req.body.to,
                req.body.message,
            )
            .then(response => {
                Log.debug('Message sent to ' + req.body.to + ' from ' + req.body.from + ' using API key ' + (req.body.apiKey || req.query.apiKey));

                this.saveMessage(req.body.to, req.body.from, req.body.message, response)
                    .then(messageId => {
                        Log.debug('Message to ' + req.body.to + ' from ' + req.body.from + ' saved to conversation');
                        res.json({success: true, messageCount: response});
                    })
                    .catch(error => {
                        Log.error('Error sending message, \'' + error.message + '\'');
                        res.json({success: false, errors: error});
                    });

            })
            .catch(error => {
                Log.error('Error sending message, \'' + error.message + '\'');
                res.json({success: false, errors: error});
            });

    }

    static saveMail(to: string, from: string, subject: string, message: string, count: number) {
        Log.debug('Saving email to ' + to + ' from ' + from);

        const db = new Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count) VALUES(\'email\', $[from], $[to], $[subject], $[message], $[count]) RETURNING id', {
            to,
            from,
            subject,
            message,
            count,
        });
    }

    static saveMessage(to: string, from: string, message: string, count: number) {
        Log.debug('Saving message to ' + to + ' from ' + from);

        const db = new Database().db;
        return db.one('INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count) VALUES(\'message\',$[from], $[to], $[message], $[count]) RETURNING id', {
            to,
            from,
            message,
            count,
        });
    }

}