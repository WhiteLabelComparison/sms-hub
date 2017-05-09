import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Supplier} from "./suppliers/supplier";
import {SendController} from "./controllers/send.controller";
import {NumberController} from "./controllers/number.controller";
import {Log} from "./log";
import {ReceiveController} from "./controllers/receive.controller";
import {ConversationController} from "./controllers/conversation.controller";

/**
 * Class for handling the web server and all routing.
 */
export class Server {
    /**
     * Hold the expressJs web hosting module.
     */
    private app: express.Express;

    constructor(private supplier: Supplier, private port: number = 7890) {
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

        this.app.post('/send/message', (req, res) => SendController.message(req,res,this.supplier) );
        this.app.get('/receive/:number', (req, res) => ReceiveController.message(req,res,this.supplier) );
        this.app.post('/number', (req, res) => NumberController.assign(req,res,this.supplier) );
        this.app.delete('/number/:number', (req, res) => NumberController.cancel(req,res,this.supplier) );
        this.app.get('/conversation', (req, res) => ConversationController.all(req,res) );
        this.app.get('/conversation/:number', (req, res) => ConversationController.with(req,res) );
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