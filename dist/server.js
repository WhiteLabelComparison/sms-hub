"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotEnv = require("dotenv");
dotEnv.config();
const server_1 = require("./app/server");
const mandrill_supplier_1 = require("./app/suppliers/mandrill/mandrill.supplier");
const nexmo_supplier_1 = require("./app/suppliers/nexmo/nexmo.supplier");
const config_1 = require("./config");
new server_1.Server(config_1.Config.port, new nexmo_supplier_1.NexmoSupplier(), new mandrill_supplier_1.MandrillSupplier());
function handler() {
    process.kill(process.pid);
}
process.on('SIGINT', handler);
//# sourceMappingURL=server.js.map