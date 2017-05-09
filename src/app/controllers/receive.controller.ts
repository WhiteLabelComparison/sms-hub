import {Supplier} from "../suppliers/supplier";
import {Log} from "../log";
import {Database} from "../../database";

export class ReceiveController {

    static message(req,res,supplier: Supplier) {
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

    static saveMessage(to: string, from: string, message: string, timestamp: string) {
        Log.debug("Saving message to " + to + " from " + from);

        let db = new Database().db;
        return db.one("INSERT INTO conversations (outbound_number, inbound_number, content, message_count, created_at) VALUES($[from], $[to], $[message], 0, $[timestamp]) RETURNING id", {
            to: to,
            from: from,
            message: message,
            timestamp: timestamp
        });
    }

}