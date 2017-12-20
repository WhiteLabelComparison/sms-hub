"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var opbeat = require('opbeat').start();
var server_1 = require("./app/server");
var mandrill_supplier_1 = require("./app/suppliers/mandrill/mandrill.supplier");
var nexmo_supplier_1 = require("./app/suppliers/nexmo/nexmo.supplier");
var config_1 = require("./config");
new server_1.Server(parseInt(config_1.Config.port), new nexmo_supplier_1.NexmoSupplier, new mandrill_supplier_1.MandrillSupplier);
//# sourceMappingURL=server.js.map