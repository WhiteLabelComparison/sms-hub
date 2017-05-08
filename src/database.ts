import * as PGP from'pg-promise';
import {Config} from "./config";
const pgp = PGP();

export class Database {
    private static instance: Database;
    public db;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.db = pgp(Config.databaseConnection);
        Database.instance = this;
    }
}
