import {SmsSupplier} from "../sms-supplier";
import {Request} from "../../request";
import {Config} from "../../../config";
import {Message} from "../../types/message";

export class NexmoSupplier implements SmsSupplier {

    /**
     * Generates a telephone number that will be used for all SMS
     * functions in the system.
     *
     * @param webhook - The URL that incoming text messages will be passed to
     */
    assignNumber(webhook: string): Promise<string> {
        return new Promise((res,rej) => {
            Request.get('https://rest.nexmo.com/number/search', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', features: 'SMS,VOICE', size: 1})
                .then(result => {
                    let chosenNumber = JSON.parse(result.body).numbers[0].msisdn;
                    Request.post('https://rest.nexmo.com/number/buy', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', msisdn: chosenNumber})
                        .then(result => {
                            Request.post('https://rest.nexmo.com/number/update', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', msisdn: chosenNumber, moHttpUrl: webhook + "/receive/message/" + chosenNumber})
                                .then(result => res(chosenNumber))
                                .catch(err => rej(err));
                        })
                        .catch(err => {
                            rej(err);
                        });
                })
                .catch(err => {
                    rej(err);
                });
        });
    }

    /**
     * Sends a text message to a given telephone number and returns
     * the number of messages that were charged for.
     *
     * @param from - The number sending the message
     * @param to - The number receiving the message
     * @param message - The text message to send
     */
    sendMessage(from: string, to: string, message: string): Promise<number> {
        return new Promise((res,rej) => {
            Request.post('https://rest.nexmo.com/sms/json', {
                api_key: Config.nexmo.key, api_secret: Config.nexmo.secret,
                from: from, to: to,
                text: message
            })
            .then(result => {
                res(JSON.parse(result.body)['message-count']);
            })
            .catch(err => rej(err));
        });
    }

    /**
     * Parses the body from an inbound message so it can be stored.
     *
     * @param request - The object sent from the GET / POST request
     */
    receive(request: any): Message {
        return {
            to: request.to,
            from: request.msisdn,
            message: request.text,
            timestamp: request['message-timestamp']
        } as Message;
    }

    /**
     * Deletes a telephone number that is being use for SMS functions.
     *
     * @param number - The ID that has been given to reference to the number
     */
    deleteNumber(number: string): Promise<boolean> {
        return new Promise((res,rej) => {
            Request.post('https://rest.nexmo.com/number/cancel', {
                api_key: Config.nexmo.key, api_secret: Config.nexmo.secret,
                country: 'GB', msisdn: number
            })
                .then(result => {
                    res("Number was Deleted");
                })
                .catch(err => rej(err));
        });
    }


}