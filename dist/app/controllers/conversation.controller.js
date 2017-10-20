"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("../../database");
var log_1 = require("../log");
var ConversationController = (function () {
    function ConversationController() {
    }
    ConversationController.all = function (req, res) {
        var db = new database_1.Database().db;
        db.query("\n            SELECT\n                type AS type,\n                outbound_number AS from,\n                inbound_number AS to,\n                subject as subject,\n                content AS message,\n                message_count AS cost,\n                created_at AS timestamp,\n                (select array_to_json(array_agg(a)) from (\n                    select filename, url\n                    from conversation_attachments where conversation_id = conversations.id\n                ) as a) as attachments\n            FROM conversations\n            WHERE inbound_number = $[number] OR inbound_number = $[address]\n            ORDER BY created_at DESC;\n            ", {
            number: req.query.number,
            address: req.query.address
        })
            .then(function (items) { return res.json({ success: true, data: items }); })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    ConversationController.allAddresses = function (req, res) {
        var db = new database_1.Database().db;
        db.query("\n            SELECT\n                outbound_number AS from,\n                inbound_number AS to,\n                subject as subject,\n                content AS message,\n                message_count AS cost,\n                created_at AS timestamp,\n                (select array_to_json(array_agg(a)) from (\n                    select filename, url\n                    from conversation_attachments where conversation_id = conversations.id\n                ) as a) as attachments\n            FROM conversations\n            WHERE \n                outbound_number = $[from]\n                OR inbound_number = $[from]\n            ORDER BY created_at DESC;\n            ", {
            from: req.query.address
        })
            .then(function (items) { return res.json({ success: true, data: items }); })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    ConversationController.withAddress = function (req, res) {
        var db = new database_1.Database().db;
        db.query("\n            SELECT\n                outbound_number AS from,\n                inbound_number AS to,\n                content AS message,\n                subject as subject,\n                message_count AS cost,\n                created_at AS timestamp,\n                (select array_to_json(array_agg(a)) from (\n                    select filename, url\n                    from conversation_attachments where conversation_id = conversations.id\n                ) as a) as attachments\n            FROM conversations\n            WHERE \n                (outbound_number = $[from] AND inbound_number = $[to])\n                OR (inbound_number = $[from] AND outbound_number = $[to])\n            ORDER BY created_at DESC;\n            ", {
            from: req.query.address,
            to: req.params.address
        })
            .then(function (items) { return res.json({ success: true, data: items }); })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    ConversationController.allNumbers = function (req, res) {
        var db = new database_1.Database().db;
        db.query("\n            SELECT\n                outbound_number AS from,\n                inbound_number AS to,\n                content AS message,\n                message_count AS cost,\n                created_at AS timestamp\n            FROM conversations\n            WHERE \n                outbound_number = $[from]\n                OR inbound_number = $[from]\n            ORDER BY created_at ASC;\n            ", {
            from: req.query.number
        })
            .then(function (items) { return res.json({ success: true, data: items }); })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    ConversationController.withNumber = function (req, res) {
        var db = new database_1.Database().db;
        db.query("\n            SELECT\n                outbound_number AS from,\n                inbound_number AS to,\n                content AS message,\n                message_count AS cost,\n                created_at AS timestamp\n            FROM conversations\n            WHERE \n                (outbound_number = $[from] AND inbound_number = $[to])\n                OR (inbound_number = $[from] AND outbound_number = $[to])\n            ORDER BY created_at ASC;\n            ", {
            from: req.query.number,
            to: req.params.number
        })
            .then(function (items) { return res.json({ success: true, data: items }); })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    return ConversationController;
}());
exports.ConversationController = ConversationController;
//# sourceMappingURL=conversation.controller.js.map