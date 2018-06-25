"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const assign_controller_1 = require("./controllers/assign.controller");
const conversation_controller_1 = require("./controllers/conversation.controller");
const receive_controller_1 = require("./controllers/receive.controller");
const send_controller_1 = require("./controllers/send.controller");
const log_1 = require("./log");
class Server {
    constructor(port = 7890, smsSupplier, emailSupplier) {
        this.port = port;
        this.smsSupplier = smsSupplier;
        this.emailSupplier = emailSupplier;
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
        this.app.use(bodyParser.json({ limit: '500mb' }));
        this.setCorsHeaders();
        this.setRoutes();
        this.startServer();
    }
    setRoutes() {
        this.app.get('/status', (req, res) => {
            return res.json({ success: true, message: 'Service is active' });
        });
        this.app.post('/send/email', this.checkApiKey, (req, res) => send_controller_1.SendController.email(req, res, this.emailSupplier));
        this.app.post('/send/message', this.checkApiKey, (req, res) => send_controller_1.SendController.message(req, res, this.smsSupplier));
        this.app.get('/receive/message/:number', (req, res) => receive_controller_1.ReceiveController.message(req, res, this.smsSupplier));
        this.app.post('/receive/email', (req, res) => receive_controller_1.ReceiveController.mail(req, res, this.emailSupplier));
        this.app.post('/assign/email', this.checkApiKey, (req, res) => assign_controller_1.AssignController.assignEmail(req, res, this.emailSupplier));
        this.app.delete('/assign/email/:domain', (req, res) => assign_controller_1.AssignController.cancelEmail(req, res, this.emailSupplier));
        this.app.post('/assign/number', this.checkApiKey, (req, res) => assign_controller_1.AssignController.assignNumber(req, res, this.smsSupplier));
        this.app.delete('/assign/number/:number', (req, res) => assign_controller_1.AssignController.cancelNumber(req, res, this.smsSupplier));
        this.app.get('/conversation', this.checkApiKey, (req, res) => conversation_controller_1.ConversationController.all(req, res));
        this.app.get('/conversation/messages', this.checkApiKey, (req, res) => conversation_controller_1.ConversationController.allNumbers(req, res));
        this.app.get('/conversation/messages/:number', this.checkApiKey, (req, res) => conversation_controller_1.ConversationController.withNumber(req, res));
        this.app.get('/conversation/emails', this.checkApiKey, (req, res) => conversation_controller_1.ConversationController.allAddresses(req, res));
        this.app.get('/conversation/emails/:address', this.checkApiKey, (req, res) => conversation_controller_1.ConversationController.withAddress(req, res));
    }
    checkApiKey(req, res, next) {
        if (req.body.apiKey === undefined && req.query.apiKey === undefined) {
            log_1.Log.warning('Attempt to send a message without supplying an API key');
            res.status(401);
            res.json({ success: false, message: 'No API key provided' });
            return;
        }
        else {
            next();
        }
    }
    setCorsHeaders() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
            next();
        });
    }
    startServer() {
        this.app.listen(this.port, () => log_1.Log.info('Server now running on port ' + this.port));
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map