import {Supplier} from "../suppliers/supplier";
import {Log} from "../log";
import {Database} from "../../database";

export class NumberController {

    static assign(req,res,supplier: Supplier) {
        let errors: string[] = [];

        if (req.body.apiKey === undefined) {
            Log.warning("Attempt to assign a number without supplying an API key");
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        }

        if (errors.length > 0) {
            res.status(400);
            res.json({success: false, errors: errors});
            return;
        }

        Log.notice("Requesting new number for API Key " + req.body.apiKey);
        supplier.assignNumber("http://sdfsdfsdfsdf.sdfsdf.com")
            .then(response => {
                Log.notice("New number (" + response + ") created for API key " + req.body.apiKey);
                this.createNumber(req.body.apiKey, response).then(number => {
                    Log.notice("New Number inserted into database");
                    res.json({success: true, telephoneNumber: response});
                }).catch(error => res.json({success: false, errors: error}));
            })
            .catch(error => res.json({success: false, errors: error}));
    }

    static cancel(req,res,supplier: Supplier) {
        let errors: string[] = [];

        if (req.body.apiKey === undefined) {
            Log.warning("Attempt to remove a number without supplying an API key");
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        }

        if (errors.length > 0) {
            res.status(400);
            res.json({success: false, errors: errors});
            return;
        }

        supplier.deleteNumber(req.params.number)
            .then(response => res.json({success: true, message: response}))
            .catch(error => res.json({success: false, errors: error}));
    }


    static createNumber(apikeyId: string, number: string): Promise<string> {
        Log.notice("Adding number (" + number + ") into database for API Key " + apikeyId)

        let db = new Database().db;
        return db.one("INSERT INTO numbers (apikey_id, number) VALUES($[apikeyId], $[number]) RETURNING number;", {
                apikeyId: apikeyId,
                number: number
            });
    }

}