import {Message} from "../types/message";

/** Interface to define a supplier and the required functions */
export interface Supplier {

    /**
     * Generates a telephone number that will be used for all SMS
     * functions in the system.
     *
     * @param webhook - The URL that incoming text messages will be passed to
     */
    assignNumber(webhook: string): Promise<string>;

    /**
     * Sends a text message to a given telephone number and returns
     * the number of messages that were charged for.
     *
     * @param from - The number sending the message
     * @param to - The number receiving the message
     * @param message - The text message to send
     */
    sendMessage(from: string, to: string, message: string): Promise<number>;

    /**
     * Parses the body from an inbound message so it can be stored.
     *
     * @param request - The object sent from the GET / POST request
     */
    receive(request: any): Message;

    /**
     * Deletes a telephone number that is being use for SMS functions.
     *
     * @param number - The ID that has been given to reference to the number
     */
    deleteNumber(number: string): Promise<boolean>;

}