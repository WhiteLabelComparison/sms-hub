import {Config} from "./config";
import {Nexmo} from "./app/suppliers/nexmo/nexmo.supplier";
import {Server} from "./app/server";

console.log("WOOOOOOOO!");

new Server(
    new Nexmo,
    Config.port
);
