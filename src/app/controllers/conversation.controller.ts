import {Database} from "../../database";
import {Log} from "../log";

export class ConversationController {

    static all(req,res) {
        let db = new Database().db;

        db.query(`
            SELECT
                type AS type,
                outbound_number AS from,
                inbound_number AS to,
                subject as subject,
                content AS message,
                message_count AS cost,
                created_at AS timestamp
            FROM conversations
            WHERE inbound_number = $[number] OR inbound_number = $[address]
            ORDER BY created_at DESC;
            `, {
            number: req.query.number,
            address: req.query.address
        })
            .then(items => res.json({success: true, data: items}))
            .catch(error => {
                Log.error("Error adding number, '" + error.message + "'");
                res.json({success: false, errors: error})
            });

    }

    static allAddresses(req,res) {
        let db = new Database().db;

        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                subject as subject,
                content AS message,
                message_count AS cost,
                created_at AS timestamp
            FROM conversations
            WHERE 
                outbound_number = $[from]
                OR inbound_number = $[from]
            ORDER BY created_at DESC;
            `, {
            from: req.query.address
        })
            .then(items => res.json({success: true, data: items}))
            .catch(error => {
                Log.error("Error adding number, '" + error.message + "'");
                res.json({success: false, errors: error})
            });

    }

    static withAddress(req,res) {
        let db = new Database().db;

        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                content AS message,
                subject as subject,
                message_count AS cost,
                created_at AS timestamp
            FROM conversations
            WHERE 
                (outbound_number = $[from] AND inbound_number = $[to])
                OR (inbound_number = $[from] AND outbound_number = $[to])
            ORDER BY created_at DESC;
            `, {
            from: req.query.address,
            to: req.params.address
        })
            .then(items => res.json({success: true, data: items}))
            .catch(error => {
                Log.error("Error adding number, '" + error.message + "'");
                res.json({success: false, errors: error})
            });
    }



    static allNumbers(req,res) {
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

    static withNumber(req,res) {
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
            ORDER BY created_at ASC;
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