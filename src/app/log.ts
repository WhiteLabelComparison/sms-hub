import {LogMessage} from "./types/log-message";

export class Log {

    static output(message: LogMessage): void {
        let date = [
            message.timestamp.getDate() < 10 ? "0" + message.timestamp.getDate() : message.timestamp.getDate(),
            message.timestamp.getMonth() < 10 ? "0" + message.timestamp.getMonth() : message.timestamp.getMonth(),
            message.timestamp.getFullYear()
        ];

        let time = [
            message.timestamp.getHours() < 10 ? "0" + message.timestamp.getHours() : message.timestamp.getHours(),
            message.timestamp.getMinutes() < 10 ? "0" + message.timestamp.getMinutes() : message.timestamp.getMinutes(),
            message.timestamp.getSeconds() < 10 ? "0" + message.timestamp.getSeconds() : message.timestamp.getSeconds()
        ];

        let fullMessage = message.color + date.join('/') + " " + time.join(':') + " - [" + message.type + "] " + message.message + "\x1b[0m";

        console.log(fullMessage);
    }

    static error(message: string) {
        this.output({timestamp: new Date(), type: 'error', message: message, color: "\x1b[31m"} as LogMessage);
    }

    static warning(message: string) {
        this.output({timestamp: new Date(), type: 'warning', message: message, color: "\x1b[33m"} as LogMessage);
    }

    static notice(message: string) {
        this.output({timestamp: new Date(), type: 'notice', message: message, color: "\x1b[37m"} as LogMessage);
    }

}