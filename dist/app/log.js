"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    static output(message) {
        const datetime = [
            [
                message.timestamp.getDate().toString().padEnd(2, '0'),
                message.timestamp.getMonth().toString().padEnd(2, '0'),
                message.timestamp.getFullYear(),
            ].join('/'),
            [
                message.timestamp.getHours().toString().padEnd(2, '0'),
                message.timestamp.getMinutes().toString().padEnd(2, '0'),
                message.timestamp.getSeconds().toString().padEnd(2, '0'),
            ].join(':'),
        ].join(' ');
        process.stdout.write(`${message.color}${datetime} - [${message.type}] ${message.message}\x1b[0m\n`);
    }
    static error(message) {
        this.output({ timestamp: new Date(), type: 'error', message, color: '\x1b[31m' });
    }
    static warning(message) {
        this.output({ timestamp: new Date(), type: 'warning', message, color: '\x1b[33m' });
    }
    static notice(message) {
        this.output({ timestamp: new Date(), type: 'notice', message, color: '\x1b[37m' });
    }
    static debug(message) {
        this.output({ timestamp: new Date(), type: 'debug', message, color: '\x1b[35m' });
    }
    static info(message) {
        this.output({ timestamp: new Date(), type: 'info', message, color: '\x1b[36m' });
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map