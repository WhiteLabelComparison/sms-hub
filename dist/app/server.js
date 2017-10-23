"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var assign_controller_1 = require("./controllers/assign.controller");
var conversation_controller_1 = require("./controllers/conversation.controller");
var receive_controller_1 = require("./controllers/receive.controller");
var send_controller_1 = require("./controllers/send.controller");
var log_1 = require("./log");
var Server = (function () {
    function Server(port, smsSupplier, emailSupplier) {
        if (port === void 0) { port = 7890; }
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
    Server.prototype.setRoutes = function () {
        var _this = this;
        this.app.get('/status', function (req, res) {
            return res.json({ success: true, message: 'Service is active' });
        });
        this.app.post('/send/email', this.checkApiKey, function (req, res) { return send_controller_1.SendController.email(req, res, _this.emailSupplier); });
        this.app.post('/send/message', this.checkApiKey, function (req, res) { return send_controller_1.SendController.message(req, res, _this.smsSupplier); });
        this.app.get('/receive/message/:number', function (req, res) { return receive_controller_1.ReceiveController.message(req, res, _this.smsSupplier); });
        this.app.post('/receive/email', function (req, res) { return receive_controller_1.ReceiveController.mail(req, res, _this.emailSupplier); });
        this.app.post('/assign/email', this.checkApiKey, function (req, res) { return assign_controller_1.AssignController.assignEmail(req, res, _this.emailSupplier); });
        this.app.delete('/assign/email/:domain', function (req, res) { return assign_controller_1.AssignController.cancelEmail(req, res, _this.emailSupplier); });
        this.app.post('/assign/number', this.checkApiKey, function (req, res) { return assign_controller_1.AssignController.assignNumber(req, res, _this.smsSupplier); });
        this.app.delete('/assign/number/:number', function (req, res) { return assign_controller_1.AssignController.cancelNumber(req, res, _this.smsSupplier); });
        this.app.get('/conversation', this.checkApiKey, function (req, res) { return conversation_controller_1.ConversationController.all(req, res); });
        this.app.get('/conversation/messages', this.checkApiKey, function (req, res) { return conversation_controller_1.ConversationController.allNumbers(req, res); });
        this.app.get('/conversation/messages/:number', this.checkApiKey, function (req, res) { return conversation_controller_1.ConversationController.withNumber(req, res); });
        this.app.get('/conversation/emails', this.checkApiKey, function (req, res) { return conversation_controller_1.ConversationController.allAddresses(req, res); });
        this.app.get('/conversation/emails/:address', this.checkApiKey, function (req, res) { return conversation_controller_1.ConversationController.withAddress(req, res); });
    };
    Server.prototype.checkApiKey = function (req, res, next) {
        if (req.body.apiKey === undefined && req.query.apiKey === undefined) {
            log_1.Log.warning('Attempt to send a message without supplying an API key');
            res.status(401);
            res.json({ success: false, message: 'No API key provided' });
            return;
        }
        else {
            next();
        }
    };
    Server.prototype.setCorsHeaders = function () {
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
            next();
        });
    };
    Server.prototype.startServer = function () {
        var _this = this;
        this.app.listen(this.port, function () { return log_1.Log.info('Server now running on port ' + _this.port); });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map