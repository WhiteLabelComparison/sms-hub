import {Supplier} from "../suppliers/supplier";

export class NumberController {

    static assign(req,res,supplier: Supplier) {
        let errors: string[] = [];

        if (req.body.apiKey === undefined) {
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