"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
Config.port = Number(process.env.PORT || 7890);
Config.baseWebhook = (process.env.BASE_WEBHOOK || undefined);
Config.databaseConnection = (process.env.DATABASE_CONNECTION || 'postgres://smshub:smshub@localhost/smshub');
Config.nexmo = {
    key: process.env.NEXMO_KEY,
    secret: process.env.NEXMO_SECRET,
};
Config.mandrill = {
    key: process.env.MANDRILL_KEY,
};
Config.aws = {
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
};
Config.bucket = process.env.AWS_BUCKET || 'smshub';
exports.Config = Config;
//# sourceMappingURL=config.js.map