"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Log = (function () {
    function Log() {
    }
    Log.output = function (message) {
        var date = [
            message.timestamp.getDate() < 10 ? "0" + message.timestamp.getDate() : message.timestamp.getDate(),
            message.timestamp.getMonth() < 10 ? "0" + message.timestamp.getMonth() : message.timestamp.getMonth(),
            message.timestamp.getFullYear()
        ];
        var time = [
            message.timestamp.getHours() < 10 ? "0" + message.timestamp.getHours() : message.timestamp.getHours(),
            message.timestamp.getMinutes() < 10 ? "0" + message.timestamp.getMinutes() : message.timestamp.getMinutes(),
            message.timestamp.getSeconds() < 10 ? "0" + message.timestamp.getSeconds() : message.timestamp.getSeconds()
        ];
        var fullMessage = message.color + date.join('/') + " " + time.join(':') + " - [" + message.type + "] " + message.message + "\x1b[0m";
        console.log(fullMessage);
    };
    Log.error = function (message) {
        this.output({ timestamp: new Date(), type: 'error', message: message, color: "\x1b[31m" });
    };
    Log.warning = function (message) {
        this.output({ timestamp: new Date(), type: 'warning', message: message, color: "\x1b[33m" });
    };
    Log.notice = function (message) {
        this.output({ timestamp: new Date(), type: 'notice', message: message, color: "\x1b[37m" });
    };
    Log.debug = function (message) {
        this.output({ timestamp: new Date(), type: 'debug', message: message, color: "\x1b[35m" });
    };
    Log.info = function (message) {
        this.output({ timestamp: new Date(), type: 'info', message: message, color: "\x1b[36m" });
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map