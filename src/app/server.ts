import * as express from 'express';
import * as bodyParser from 'body-parser';
import {SendController} from "./controllers/send.controller";
import {Log} from "./log";
import {ReceiveController} from "./controllers/receive.controller";
import {ConversationController} from "./controllers/conversation.controller";
import {SmsSupplier} from "./suppliers/sms-supplier";
import {EmailSupplier} from "./suppliers/email-supplier";
import {AssignController} from "./controllers/assign.controller";

/**
 * Class for handling the web server and all routing.
 */
export class Server {
    /**
     * Hold the expressJs web hosting module.
     */
    private app: express.Express;

    constructor(private port: number = 7890, private smsSupplier: SmsSupplier, private emailSupplier: EmailSupplier) {
        this.app = express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.setCorsHeaders();
        this.setRoutes();
        this.startServer();
    }

    /**
     * Sets up all the required routes for this application.
     * Todo: Refactor this into a separate class
     */
    private setRoutes() {
        // Status route so we can check if the microservice is running
        this.app.get('/status', (req, res) => {
            return res.json({success: true, message: 'Service is active'});
        });

        this.app.post('/send/email', this.checkApiKey, (req, res) => SendController.email(req,res,this.emailSupplier) );
        this.app.post('/send/message', this.checkApiKey, (req, res) => SendController.message(req,res,this.smsSupplier) );
        this.app.get('/receive/message/:number', (req, res) => ReceiveController.message(req,res,this.smsSupplier) );
        this.app.post('/receive/email', (req, res) => ReceiveController.mail(req,res,this.emailSupplier) );

        this.app.post('/assign/email', this.checkApiKey, (req, res) => AssignController.assignEmail(req,res,this.emailSupplier) );
        this.app.delete('/assign/email/:domain', (req, res) => AssignController.cancelEmail(req,res,this.emailSupplier) );

        this.app.post('/assign/number', this.checkApiKey, (req, res) => AssignController.assignNumber(req,res,this.smsSupplier) );
        this.app.delete('/assign/number/:number', (req, res) => AssignController.cancelNumber(req,res,this.smsSupplier) );

        this.app.get('/conversation/messages', this.checkApiKey, (req, res) => ConversationController.allNumbers(req,res) );
        this.app.get('/conversation/messages/:number', this.checkApiKey, (req, res) => ConversationController.withNumber(req,res) );
        this.app.get('/conversation/emails', this.checkApiKey, (req, res) => ConversationController.allAddresses(req,res) );
        this.app.get('/conversation/emails/:address', this.checkApiKey, (req, res) => ConversationController.withAddress(req,res) );
    }

    private checkApiKey(req, res, next) {
        if (req.body.apiKey === undefined && req.query.apiKey === undefined) {
            Log.warning("Attempt to send a message without supplying an API key");
            res.status(401);
            res.json({success: false, message: 'No API key provided'});
            return;
        } else {
            next();
        }
    }

    /**
     * Sets any headers we require for Cross Origin Requests.
     */
    private setCorsHeaders() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
            next();
        });
    }

    /**
     * Spools up the server on the required port.
     */
    private startServer() {
        this.app.listen(this.port, () => Log.info('Server now running on port ' + this.port));
    }
}