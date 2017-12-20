"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = (function () {
    function Config() {
    }
    Config.port = (process.env.PORT || undefined);
    Config.baseWebhook = (process.env.BASE_WEBHOOK || undefined);
    Config.databaseConnection = (process.env.DATABASE_CONNECTION || undefined);
    Config.nexmo = {
        key: (process.env.NEXMO_KEY || undefined),
        secret: (process.env.NEXMO_SECRET || undefined)
    };
    Config.mandrill = {
        key: (process.env.MANDRILL_KEY || undefined)
    };
    Config.aws = {
        key: (process.env.AWS_KEY || undefined),
        secret: (process.env.AWS_SECRET || undefined)
    };
    Config.bucket = (process.env.AWS_BUCKET || undefined);
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map