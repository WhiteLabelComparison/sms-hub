import {Supplier} from "../suppliers/supplier";

export class SendController {

    static message(req,res,supplier: Supplier) {
        let errors: string[] = [];

        if (req.body.apiKey === undefined) {
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        }

        if (req.body.message === undefined || req.body.message.length == 0) {
            errors.push("No message was defined");
        }

        if (req.body.from === undefined || req.body.from.length == 0) {
            errors.push("No 'from' telephone number was defined");
        }

        if (req.body.to === undefined || req.body.to.length == 0) {
            errors.push("No 'to' telephone number was defined");
        }

        if (errors.length > 0) {
            res.status(400);
            res.json({success: false, errors: errors});
            return;
        }

        supplier.sendMessage(
                req.body.from,
                req.body.to,
                req.body.message
            )
            .then(response => res.json({success: true, messageCount: response}))
            .catch(error => res.json({success: false, errors: error}));

    }

}