import {Supplier} from "../supplier";
import {TelephoneNumber} from "../../types/telephone-number";
import {Request} from "../../request";
import {Config} from "../../../config";

export class Nexmo implements Supplier {

    assignNumber(webhook: string): Promise<string> {
        return new Promise((res,rej) => {
            Request.get('https://rest.nexmo.com/number/search', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', features: 'SMS,VOICE', size: 1})
                .then(result => {
                    let chosenNumber = JSON.parse(result.body).numbers[0].msisdn;
                    Request.post('https://rest.nexmo.com/number/buy', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', msisdn: chosenNumber})
                        .then(result => {
                            Request.post('https://rest.nexmo.com/number/update', {api_key: Config.nexmo.key, api_secret: Config.nexmo.secret, country: 'GB', msisdn: chosenNumber, moHttpUrl: webhook})
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

    receive() {
    }

    deleteNumber(number: string): Promise<boolean> {
        return new Promise((res,rej) => {
            Request.post('https://rest.nexmo.com/number/cancel', {
                api_key: Config.nexmo.key, api_secret: Config.nexmo.secret,
                country: 'GB', msisdn: number
            })
                .then(result => {
                    // console.log(result);
                    res("Number was Deleted");
                })
                .catch(err => rej(err));
        });
    }


}