import {Supplier} from "../suppliers/supplier";
import {Log} from "../log";
import {Database} from "../../database";

export class ReceiveController {

    static message(req,res,supplier: Supplier) {
        let errors: string[] = [];

        Log.debug("Inbound message detected");
        let receivedMessage = supplier.receive(req.body);

        this.saveMessage(receivedMessage.to, receivedMessage.from, receivedMessage.message)
            .then(messageId => res.json({success: true, message: 'Message has been saved.'}))
            .catch(error => {
                Log.error("Error sending message, '" + error.message + "'");
                res.json({success: false, errors: error})
            });
    }

    static saveMessage(to: string, from: string, message: string) {
        Log.debug("Saving message to " + to + " from " + from);

        let db = new Database().db;
        return db.one("INSERT INTO conversations (outbound_number, inbound_number, content, message_count) VALUES($[from], $[to], $[message], 0) RETURNING id", {
            to: to,
            from: from,
            message: message
        });
    }

}