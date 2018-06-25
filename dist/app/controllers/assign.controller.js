"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const database_1 = require("../../database");
const config_1 = require("../../config");
const validation_1 = require("../validation");
class AssignController {
    static assignEmail(req, res, supplier) {
        const errors = validation_1.Validation.checkFieldsIn(req.body, ['domain']);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors });
            return;
        }
        supplier.assignInbound(config_1.Config.baseWebhook, req.body.domain)
            .then(response => {
            res.json({ success: true, message: 'Domain has been assigned' });
        })
            .catch(error => {
            res.json({ success: false, errors: error });
        });
    }
    static cancelEmail(req, res, supplier) {
    }
    static assignNumber(req, res, supplier) {
        const errors = validation_1.Validation.checkFieldsIn(req.body, []);
        if (errors) {
            res.status(400);
            res.json({ success: false, errors });
            return;
        }
        log_1.Log.debug('Requesting new number for API Key ' + req.body.apiKey);
        supplier.assignNumber(config_1.Config.baseWebhook)
            .then(response => {
            log_1.Log.debug('New number (' + response + ') created for API key ' + req.body.apiKey);
            this.createNumber(req.body.apiKey, response).then(number => {
                log_1.Log.debug('New Number (' + response + ') inserted into database for API key ' + req.body.apiKey);
                res.json({ success: true, telephoneNumber: response });
            })
                .catch(error => {
                log_1.Log.error('Error adding number, \'' + error.message + '\'');
                res.json({ success: false, errors: error });
            });
        })
            .catch(error => {
            log_1.Log.error('Error adding number, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static cancelNumber(req, res, supplier) {
        const errors = [];
        if (req.body.apiKey === undefined) {
            log_1.Log.warning('Attempt to remove a number without supplying an API key');
            res.status(401);
            res.json({ success: false, message: 'No API key provided' });
            return;
        }
        if (errors.length > 0) {
            res.status(400);
            res.json({ success: false, errors });
            return;
        }
        log_1.Log.debug('Deleting number (' + req.params.number + ') for API Key ' + req.body.apiKey);
        supplier.deleteNumber(req.params.number)
            .then(response => {
            log_1.Log.debug('Deleting number (' + req.params.number + ') from supplier for API Key ' + req.body.apiKey);
            this.deleteNumber(req.body.apiKey, req.params.number)
                .then(response => {
                log_1.Log.debug('Deleted number (' + req.params.number + ') from database for API Key ' + req.body.apiKey);
                res.json({ success: true, message: 'Number was deleted' });
            })
                .catch(error => {
                log_1.Log.error('Error deleting number, \'' + error.message + '\'');
                res.json({ success: false, errors: error });
            });
        })
            .catch(error => {
            log_1.Log.error('Error deleting number, \'' + error.message + '\'');
            res.json({ success: false, errors: error });
        });
    }
    static createNumber(apikeyId, number) {
        log_1.Log.debug('Adding number (' + number + ') into database for API Key ' + apikeyId);
        const db = new database_1.Database().db;
        return db.one('INSERT INTO numbers (apikey_id, number) VALUES($[apikeyId], $[number]) RETURNING number;', {
            apikeyId,
            number,
        });
    }
    static deleteNumber(apikeyId, number) {
        log_1.Log.debug('Deleting number (' + number + ') from database for API Key ' + apikeyId);
        const db = new database_1.Database().db;
        return db.none('DELETE FROM numbers WHERE apikey_id = $[apikeyId] AND number = $[number];', {
            apikeyId,
            number,
        });
    }
}
exports.AssignController = AssignController;
//# sourceMappingURL=assign.controller.js.map