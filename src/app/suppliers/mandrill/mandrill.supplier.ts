import { Config } from '../../../config'
import { Request } from '../../request'
import { Mail, MailAttachment } from '../../types/mail'
import { EmailSupplier } from '../email-supplier'

export class MandrillSupplier implements EmailSupplier {

  assignInbound (webhook: string, domain: string): Promise<string> {
    return new Promise ((res, rej) => {
      Request.post ('https://mandrillapp.com/api/1.0/inbound/add-domain.json',
        {
          'key': Config.mandrill.key,
          'domain': domain
        })
      .then (response => {
        console.log ({
          'key': Config.mandrill.key,
          'domain': domain,
          'pattern': '*',
          'url': webhook + '/receive/email/' + domain
        })

        Request.post ('https://mandrillapp.com/api/1.0/inbound/add-route.json',
          {
            'key': Config.mandrill.key,
            'domain': domain,
            'pattern': '*',
            'url': webhook + '/receive/email'
          })
        .then (response => {
          res (response)
        })
        .catch (error => rej (error))
      })
      .catch (error => rej (error))
    })
  }

  sendMessage (from: string, to: string, subject: string, message: string): Promise<number> {
    return new Promise ((res, rej) => {
      Request.post ('http://mandrillapp.com/api/1.0/messages/send.json',
        {
          key: Config.mandrill.key,
          message: {
            html: message,
            subject: subject,
            from_email: from,
            to: [{email: to}]
          }
        })
      .then (response => res (response))
      .catch (error => rej (error))
    })
  }

  receive (request: any): Mail {

    let attachments = []
    let mandrillEvent = JSON.parse (request.mandrill_events)
    if (mandrillEvent[0] === undefined) {
      return null
    }
    let mailMessage = mandrillEvent[0].msg

    // File attachments
    if (mailMessage.attachments) {
      for (let i in mailMessage.attachments) {
        attachments.push ({
          'filename': mailMessage.attachments[i].name,
          'content': mailMessage.attachments[i].base64 ? Buffer.from (mailMessage.attachments[i].content.toString (), 'base64') : mailMessage.attachments[i].content
        } as MailAttachment)
      }
    }

    // Image attachments
    if (mailMessage.images) {
      for (let i in mailMessage.images) {
        attachments.push ({
          'filename': mailMessage.images[i].name,
          'content': mailMessage.images[i].content
        } as MailAttachment)
      }
    }

    return {
      'to': mailMessage.email,
      'from': mailMessage.from_email,
      'subject': mailMessage.subject,
      'message': mailMessage.html ? mailMessage.html : mailMessage.text,
      'attachments': attachments
    } as Mail
  }

  deleteInbound (number: string): Promise<boolean> {
    throw new Error ('Method not implemented.')
  }

}