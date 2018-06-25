import { LogMessage } from './types/log-message';

/**
 * Class used to output system messages.
 */
export class Log {

  /**
   * Outputs the message to the console with the appropriate colors for the CLI.
   *
   * @param message - LogMessage class populated with appropriate data.
   */
  static output(message: LogMessage): void {
    // Create an array of date items we can join for a nicely formatted string.

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

    // Generate a string holding the direct output of our message.
    process.stdout.write(`${message.color}${datetime} - [${message.type}] ${message.message}\x1b[0m\n`);

  }

  /**
   * Logs a error message.
   *
   * @param message - A string holding the message to be displayed.
   */
  static error(message: string) {
    this.output({ timestamp: new Date(), type: 'error', message, color: '\x1b[31m' } as LogMessage);
  }

  /**
   * Logs a warning message.
   *
   * @param message - A string holding the message to be displayed.
   */
  static warning(message: string) {
    this.output({ timestamp: new Date(), type: 'warning', message, color: '\x1b[33m' } as LogMessage);
  }

  /**
   * Logs a simple notice
   *
   * @param message - A string holding the message to be displayed.
   */
  static notice(message: string) {
    this.output({ timestamp: new Date(), type: 'notice', message, color: '\x1b[37m' } as LogMessage);
  }

  /**
   * Logs a simple debug message
   *
   * @param message - A string holding the message to be displayed.
   */
  static debug(message: string) {
    this.output({ timestamp: new Date(), type: 'debug', message, color: '\x1b[35m' } as LogMessage);
  }

  /**
   * Logs a simple notice
   *
   * @param message - A string holding the message to be displayed.
   */
  static info(message: string) {
    this.output({ timestamp: new Date(), type: 'info', message, color: '\x1b[36m' } as LogMessage);
  }

}