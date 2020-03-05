import { Database } from '../../database';
import { Log } from '../log';

export class ConversationController {

    static all(req, res) {
        const db = new Database().db;

        db.query(`
            SELECT
                type AS type,
                outbound_number AS from,
                inbound_number AS to,
                subject as subject,
                content AS message,
                message_count AS cost,
                created_at AS timestamp,
                (select array_to_json(array_agg(a)) from (
                    select filename, url
                    from conversation_attachments where conversation_id = conversations.id
                ) as a) as attachments
            FROM conversations
            WHERE inbound_number = $[number] OR inbound_number = $[address]
            ORDER BY created_at DESC
LIMIT 10;
            `, {
            number: req.query.number,
            address: req.query.address,
        })
          .then(items => res.json({ success: true, data: items }))
          .catch(error => {
              Log.error('Error adding number, \'' + error.message + '\'');
              res.json({ success: false, errors: error });
          });

    }

    static allAddresses(req, res) {
        const db = new Database().db;

        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                subject as subject,
                content AS message,
                message_count AS cost,
                created_at AS timestamp,
                (select array_to_json(array_agg(a)) from (
                    select filename, url
                    from conversation_attachments where conversation_id = conversations.id
                ) as a) as attachments
            FROM conversations
            WHERE
                outbound_number = $[from]
                OR inbound_number = $[from]
            ORDER BY created_at DESC
LIMIT 10;
            `, {
            from: req.query.address,
        })
          .then(items => res.json({ success: true, data: items }))
          .catch(error => {
              Log.error('Error adding number, \'' + error.message + '\'');
              res.json({ success: false, errors: error });
          });

    }

    static withAddress(req, res) {
        const db = new Database().db;
        db.query(`
            SELECT
                outbound_number AS from,
                inbound_number AS to,
                content AS message,
                subject as subject,
                message_count AS cost,
                created_at AS timestamp,
                (select array_to_json(array_agg(a)) from (
                    select filename, url
                    from conversation_attachments where conversation_id = conversations.id
                ) as a) as attachments
            FROM conversations
            WHERE
                (outbound_number = $[from] AND inbound_number = $[to])
                OR (inbound_number = $[from] AND outbound_number = $[to])
            ORDER BY created_at DESC
LIMIT 10;
            `, {
            from: req.query.address,
            to: req.params.address,
        })
          .then(items => res.json({ success: true, data: items }))
          .catch(error => {
              Log.error('Error adding number, \'' + error.message + '\'');
              res.json({ success: false, errors: error });
          });
    }

    static allNumbers(req, res) {
        const db = new Database().db;

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
            ORDER BY created_at ASC
LIMIT 10;
            `, {
            from: req.query.number,
        })
          .then(items => res.json({ success: true, data: items }))
          .catch(error => {
              Log.error('Error adding number, \'' + error.message + '\'');
              res.json({ success: false, errors: error });
          });

    }

    static withNumber(req, res) {
        const db = new Database().db;

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
            ORDER BY created_at ASC
LIMIT $[limit];
            `, {
            from: req.query.number,
            to: req.params.number,
          limit: req.query.limit ? req.params.limit : 10,
        })
          .then(items => res.json({ success: true, data: items }))
          .catch(error => {
              Log.error('Error adding number, \'' + error.message + '\'');
              res.json({ success: false, errors: error });
          });
    }

}
