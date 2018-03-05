"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PGP = require("pg-promise");
var config_1 = require("./config");
var pgp = PGP();
var Database = (function () {
    function Database() {
        if (Database.instance) {
            return Database.instance;
        }
        this.db = pgp(config_1.Config.databaseConnection);
        Database.instance = this;
    }
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=database.js.map