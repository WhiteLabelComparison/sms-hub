"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PGP = require("pg-promise");
const config_1 = require("./config");
const pgp = PGP();
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.db = pgp(config_1.Config.databaseConnection);
        Database.instance = this;
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map