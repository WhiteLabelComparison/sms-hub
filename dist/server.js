"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotEnv = require("dotenv");
var opBeat = require("opbeat");
dotEnv.config();
opBeat.start();
var server_1 = require("./app/server");
var mandrill_supplier_1 = require("./app/suppliers/mandrill/mandrill.supplier");
var nexmo_supplier_1 = require("./app/suppliers/nexmo/nexmo.supplier");
var config_1 = require("./config");
new server_1.Server(Number(config_1.Config.port), new nexmo_supplier_1.NexmoSupplier, new mandrill_supplier_1.MandrillSupplier);
//# sourceMappingURL=server.js.map