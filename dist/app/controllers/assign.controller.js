"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var database_1 = require("../../database");
var config_1 = require("../../config");
var validation_1 = require("../validation");
var AssignController = (function () {
    function AssignController() {
    }
    AssignController.assignEmail = function (req, res, supplier) {
        var errors = validation_1.Validation.checkFieldsIn(req.body, ['domain']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors: errors });
            return;
        }
        supplier.assignInbound(config_1.Config.baseWebhook, req.body.domain)
            .then(function (response) {
            res.json({ success: true, message: 'Domain has been assigned' });
        })
            .catch(function (error) {
            res.json({ success: false, errors: error });
        });
    };
    AssignController.cancelEmail = function (req, res, supplier) {
    };
    AssignController.assignNumber = function (req, res, supplier) {
        var _this = this;
        var errors = validation_1.Validation.checkFieldsIn(req.body, []);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors: errors });
            return;
        }
        log_1.Log.debug("Requesting new number for API Key " + req.body.apiKey);
        supplier.assignNumber(config_1.Config.baseWebhook)
            .then(function (response) {
            log_1.Log.debug("New number (" + response + ") created for API key " + req.body.apiKey);
            _this.createNumber(req.body.apiKey, response).then(function (number) {
                log_1.Log.debug("New Number (" + response + ") inserted into database for API key " + req.body.apiKey);
                res.json({ success: true, telephoneNumber: response });
            })
                .catch(function (error) {
                log_1.Log.error("Error adding number, '" + error.message + "'");
                res.json({ success: false, errors: error });
            });
        })
            .catch(function (error) {
            log_1.Log.error("Error adding number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    AssignController.cancelNumber = function (req, res, supplier) {
        var _this = this;
        var errors = [];
        if (req.body.apiKey === undefined) {
            log_1.Log.warning("Attempt to remove a number without supplying an API key");
            res.status(401);
            res.json({ success: false, message: 'No API key provided' });
            return;
        }
        if (errors.length > 0) {
            res.status(400);
            res.json({ success: false, errors: errors });
            return;
        }
        log_1.Log.debug("Deleting number (" + req.params.number + ") for API Key " + req.body.apiKey);
        supplier.deleteNumber(req.params.number)
            .then(function (response) {
            log_1.Log.debug("Deleting number (" + req.params.number + ") from supplier for API Key " + req.body.apiKey);
            _this.deleteNumber(req.body.apiKey, req.params.number)
                .then(function (response) {
                log_1.Log.debug("Deleted number (" + req.params.number + ") from database for API Key " + req.body.apiKey);
                res.json({ success: true, message: 'Number was deleted' });
            })
                .catch(function (error) {
                log_1.Log.error("Error deleting number, '" + error.message + "'");
                res.json({ success: false, errors: error });
            });
        })
            .catch(function (error) {
            log_1.Log.error("Error deleting number, '" + error.message + "'");
            res.json({ success: false, errors: error });
        });
    };
    AssignController.createNumber = function (apikeyId, number) {
        log_1.Log.debug("Adding number (" + number + ") into database for API Key " + apikeyId);
        var db = new database_1.Database().db;
        return db.one("INSERT INTO numbers (apikey_id, number) VALUES($[apikeyId], $[number]) RETURNING number;", {
            apikeyId: apikeyId,
            number: number
        });
    };
    AssignController.deleteNumber = function (apikeyId, number) {
        log_1.Log.debug("Deleting number (" + number + ") from database for API Key " + apikeyId);
        var db = new database_1.Database().db;
        return db.none("DELETE FROM numbers WHERE apikey_id = $[apikeyId] AND number = $[number];", {
            apikeyId: apikeyId,
            number: number
        });
    };
    return AssignController;
}());
exports.AssignController = AssignController;
//# sourceMappingURL=assign.controller.js.map