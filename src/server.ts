import {Config} from "./config";
import {NexmoSupplier} from "./app/suppliers/nexmo/nexmo.supplier";
import {Server} from "./app/server";
import {MandrillSupplier} from "./app/suppliers/mandrill/mandrill.supplier";

// Create a new server and pass the required supplier and server port.
new Server(
    Config.port,
    new NexmoSupplier,
    new MandrillSupplier
);
