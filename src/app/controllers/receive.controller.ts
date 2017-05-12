import {Log} from "../log";
import {Database} from "../../database";
import {SmsSupplier} from "../suppliers/sms-supplier";
import {EmailSupplier} from "../suppliers/email-supplier";

export class ReceiveController {

    static mail(req, res, supplier: EmailSupplier) {

        Log.debug("Inbound Email detected");
        let receivedMessage = supplier.receive(req.body);

        if (!receivedMessage) {
            res.json({success: true});
            return;
        }

        this.saveEmail(receivedMessage.to, receivedMessage.from, receivedMessage.subject, receivedMessage.message, receivedMessage.timestamp)
            .then(messageId => res.json({success: true, message: 'Email has been saved.'}))
            .catch(error => {
                Log.error("Error sending message, '" + error.message + "'");
                res.json({success: false, errors: error})
            });

    };

    static message(req,res,supplier: SmsSupplier) {
        let errors: string[] = [];

        Log.debug("Inbound message detected");
        let receivedMessage = supplier.receive(req.query);

        this.saveMessage(receivedMessage.to, receivedMessage.from, receivedMessage.message, receivedMessage.timestamp)
            .then(messageId => res.json({success: true, message: 'Message has been saved.'}))
            .catch(error => {
                Log.error("Error sending message, '" + error.message + "'");
                res.json({success: false, errors: error})
            });
    }

    static saveEmail(to: string, from: string, subject: string, message: string, timestamp: string) {
        Log.debug("Saving message to " + to + " from " + from);

        let db = new Database().db;
        return db.one("INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count, created_at) VALUES('email',$[from], $[to], $[subject], $[message], 0, NOW()) RETURNING id", {
            to: to,
            from: from,
            subject: subject,
            message: message,
            timestamp: timestamp
        });
    }

    static saveMessage(to: string, from: string, message: string, timestamp: string) {
        Log.debug("Saving message to " + to + " from " + from);

        let db = new Database().db;
        return db.one("INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count, created_at) VALUES('message',$[from], $[to], $[message], 0, $[timestamp]) RETURNING id", {
            to: to,
            from: from,
            message: message,
            timestamp: timestamp
        });
    }

}