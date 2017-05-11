import {EmailSupplier} from "../email-supplier";
import {Mail} from "../../types/mail";
import {Config} from "../../../config";
import {Request} from "../../request";

export class MandrillSupplier implements EmailSupplier{

    assignInbound(webhook: string, domain: string): Promise<string> {
        return new Promise((res,rej) => {
            Request.post('https://mandrillapp.com/api/1.0/inbound/add-domain.json',
                {
                    "key": Config.mandrill.key,
                    "domain": domain
                })
                .then(response => {
                    console.log({
                        "key": Config.mandrill.key,
                        "domain": domain,
                        "pattern": "*",
                        "url": webhook + "/receive/email/" + domain
                    });

                    Request.post('https://mandrillapp.com/api/1.0/inbound/add-route.json',
                        {
                            "key": Config.mandrill.key,
                            "domain": domain,
                            "pattern": "*",
                            "url": webhook + "/receive/email"
                        })
                        .then(response => {
                            res(response);
                        })
                        .catch(error => rej(error));
                })
                .catch(error => rej(error));
        });
    }

    sendMessage(from: string, to: string, subject: string, message: string): Promise<number> {
        return new Promise((res,rej) => {
            Request.post('http://mandrillapp.com/api/1.0/messages/send.json',
                {
                    key: Config.mandrill.key,
                    message: {
                        html: message,
                        subject: subject,
                        from_email: from,
                        to: [{email: to}]
                    }
                })
                .then(response => res(response))
                .catch(error => rej(error));
        });
    }

    receive(request: any): Mail {
        let mandrillEvent = JSON.parse(request.mandrill_events);
        if (mandrillEvent[0] === undefined) {
            return null;
        }

        let mailMessage = mandrillEvent[0].msg;
        return {
            to: mailMessage.email,
            from: mailMessage.from_email,
            subject: mailMessage.subject,
            message: mailMessage.html ? mailMessage.html : mailMessage.text
        } as Mail;
    }

    deleteInbound(number: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

}