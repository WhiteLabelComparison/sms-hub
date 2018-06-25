import {Log} from '../log';
import {Database} from '../../database';
import {Config} from '../../config';
import {SmsSupplier} from '../suppliers/sms-supplier';
import {EmailSupplier} from '../suppliers/email-supplier';
import {Validation} from '../validation';

export class AssignController {

    static assignEmail(req, res, supplier: EmailSupplier) {
        const errors: string[]|boolean = Validation.checkFieldsIn(req.body, ['domain']);

        if (errors) {
            res.status(400);
            res.json({success: false, errors});
            return;
        }

        supplier.assignInbound(Config.baseWebhook, req.body.domain)
            .then(response => {
                res.json({success: true, message: 'Domain has been assigned'});
            })
            .catch(error => {
                res.json({success: false, errors: error});
            });

    }

    static cancelEmail(req, res, supplier: EmailSupplier) {

    }

    static assignNumber(req, res, supplier: SmsSupplier) {
        const errors: string[]|boolean = Validation.checkFieldsIn(req.body, []);

        if (errors) {
            res.status(400);
            res.json({success: false, errors});
            return;
        }

        Log.debug('Requesting new number for API Key ' + req.body.apiKey);
        supplier.assignNumber(Config.baseWebhook)
            .then(response => {
                Log.debug('New number (' + response + ') created for API key ' + req.body.apiKey);
                this.createNumber(req.body.apiKey, response).then(number => {
                    Log.debug('New Number (' + response + ') inserted into database for API key ' + req.body.apiKey);
                    res.json({success: true, telephoneNumber: response});
                })
                .catch(error => {
                    Log.error('Error adding number, \'' + error.message + '\'');
                    res.json({success: false, errors: error});
                });
            })
            .catch(error => {
                Log.error('Error adding number, \'' + error.message + '\'');
                res.json({success: false, errors: error});
            });
    }

    static cancelNumber(req, res, supplier: SmsSupplier) {
        const errors: string[] = [];

        if (req.body.apiKey === undefined) {
            Log.warning('Attempt to remove a number without supplying an API key');
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        }

        if (errors.length > 0) {
            res.status(400);
            res.json({success: false, errors});
            return;
        }

        Log.debug('Deleting number (' + req.params.number + ') for API Key ' + req.body.apiKey);
        supplier.deleteNumber(req.params.number)
            .then(response => {
                Log.debug('Deleting number (' + req.params.number + ') from supplier for API Key ' + req.body.apiKey);
                this.deleteNumber(req.body.apiKey, req.params.number)
                    .then(response => {
                        Log.debug('Deleted number (' + req.params.number + ') from database for API Key ' + req.body.apiKey);
                        res.json({success: true, message: 'Number was deleted'});
                    })
                    .catch(error => {
                        Log.error('Error deleting number, \'' + error.message + '\'');
                        res.json({success: false, errors: error});
                    });
            })
            .catch(error => {
                Log.error('Error deleting number, \'' + error.message + '\'');
                res.json({success: false, errors: error});
            });
    }

    static createNumber(apikeyId: string, number: string): Promise<string> {
        Log.debug('Adding number (' + number + ') into database for API Key ' + apikeyId);

        const db = new Database().db;
        return db.one('INSERT INTO numbers (apikey_id, number) VALUES($[apikeyId], $[number]) RETURNING number;', {
                apikeyId,
                number,
            });
    }

    static deleteNumber(apikeyId: string, number: string): Promise<boolean> {
        Log.debug('Deleting number (' + number + ') from database for API Key ' + apikeyId);

        const db = new Database().db;
        return db.none('DELETE FROM numbers WHERE apikey_id = $[apikeyId] AND number = $[number];', {
            apikeyId,
            number,
        });
    }

}