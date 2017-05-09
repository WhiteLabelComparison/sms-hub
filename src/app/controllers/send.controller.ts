import {Supplier} from "../suppliers/supplier";
import {Log} from "../log";
import {Database} from "../../database";

export class SendController {

    static message(req,res,supplier: Supplier) {
        let errors: string[] = [];

        if (req.body.apiKey === undefined) {
            Log.warning("Attempt to send a message without supplying an API key");
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        }

        if (req.body.message === undefined || req.body.message.length == 0) {
            errors.push("No message was defined");
        }

        if (req.body.from === undefined || req.body.from.length == 0) {
            errors.push("No 'from' telephone number was defined");
        }

        if (req.body.to === undefined || req.body.to.length == 0) {
            errors.push("No 'to' telephone number was defined");
        }

        if (errors.length > 0) {
            res.status(400);
            res.json({success: false, errors: errors});
            return;
        }

        Log.debug("Sending message to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);
        supplier.sendMessage(
                req.body.from,
                req.body.to,
                req.body.message
            )
            .then(response => {
                Log.debug("Message sent to " + req.body.to + " from " + req.body.from + " using API key " + req.body.apiKey);

                this.saveMessage(req.body.to, req.body.from, req.body.message, response)
                    .then(messageId => {
                        Log.debug("Message to " + req.body.to + " from " + req.body.from + " saved to conversation");
                        res.json({success: true, messageCount: response});
                    })
                    .catch(error => {
                        Log.error("Error sending message, '" + error.message + "'");
                        res.json({success: false, errors: error})
                    });

            })
            .catch(error => {
                Log.error("Error sending message, '" + error.message + "'");
                res.json({success: false, errors: error})
            });

    }

    static saveMessage(to: string, from: string, message: string, count: number) {
        Log.debug("Saving message to " + to + " from " + from);

        let db = new Database().db;
        return db.one("INSERT INTO conversations (outbound_number, inbound_number, content, message_count) VALUES($[from], $[to], $[message], $[count]) RETURNING id", {
            to: to,
            from: from,
            message: message,
            count: count
        });
    }

}