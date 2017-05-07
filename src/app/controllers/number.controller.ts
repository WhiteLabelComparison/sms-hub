import {Supplier} from "../suppliers/supplier";
import {Log} from "../log";

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

        supplier.assignNumber("http://sdfsdfsdfsdf.sdfsdf.com")
            .then(response => res.json({success: true, telephoneNumber: response}))
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

}