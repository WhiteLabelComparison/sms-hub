import {Config} from "./config";
import {Nexmo} from "./app/suppliers/nexmo/nexmo.supplier";
import {Server} from "./app/server";

// Create a new server and pass the required supplier and server port.
new Server(
    new Nexmo,
    Config.port
);
