import {Database} from "../../database";
import {Log} from "../log";

export class ConversationController {

    static all(req,res) {
        let db = new Database().db;

        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                content AS message,
                message_count AS cost,
                created_at AS timestamp
            FROM conversations
            WHERE 
                outbound_number = $[from]
                OR inbound_number = $[from]
            ORDER BY created_at ASC;
            `, {
                from: req.query.number
            })
            .then(items => res.json({success: true, data: items}))
            .catch(error => {
                Log.error("Error adding number, '" + error.message + "'");
                res.json({success: false, errors: error})
            });

    }

    static with(req,res) {
        let db = new Database().db;

        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                content AS message,
                message_count AS cost,
                created_at AS timestamp
            FROM conversations
            WHERE 
                (outbound_number = $[from] AND inbound_number = $[to])
                OR (inbound_number = $[from] AND outbound_number = $[to])
            ORDER BY timestamp ASC;
            `, {
                from: req.query.number,
                to: req.params.number
            })
            .then(items => res.json({success: true, data: items}))
            .catch(error => {
                Log.error("Error adding number, '" + error.message + "'");
                res.json({success: false, errors: error})
            });
    }

}