import * as aws from 'aws-sdk'
import { Config } from '../../config'
import { Database } from '../../database'
import { Log } from '../log'
import { Request } from '../request'
import { EmailSupplier } from '../suppliers/email-supplier'
import { SmsSupplier } from '../suppliers/sms-supplier'
import { MailAttachment } from '../types/mail'

export class ReceiveController {

  static mail (req, res, supplier: EmailSupplier) {

    Log.debug ('Inbound Email detected')
    let receivedMessage = supplier.receive (req.body)

    if (!receivedMessage) {
      res.json ({success: true})
      return
    }

    this.saveEmail (receivedMessage.to, receivedMessage.from, receivedMessage.subject, receivedMessage.message, receivedMessage.timestamp, receivedMessage.attachments)
    .then (messageId => res.json ({success: true, message: 'Email has been saved.'}))
    .then (() => {
      let db = new Database ().db
      db.one (`
        SELECT
        CASE
        WHEN
                COUNT((SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)) > 0
        THEN
                (SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)
        ELSE
                NULL
        END AS url
      `, {
        to: receivedMessage.to
      })
      .then (result => {
        if (result.url && result.url !== null) {
          Request.post (result.url + '/email', {
            to: receivedMessage.to,
            from: receivedMessage.from
          })
        }
      })
    })
    .catch (error => {
      Log.error ('Error sending message, \'' + error.message + '\'')
      res.json ({success: false, errors: error})
    })

  };

  static message (req, res, supplier: SmsSupplier) {
    let errors: string[] = []

    Log.debug ('Inbound message detected')
    let receivedMessage = supplier.receive (req.query)

    this.saveMessage (receivedMessage.to, receivedMessage.from, receivedMessage.message, receivedMessage.timestamp)
    .then (messageId => res.json ({success: true, message: 'Message has been saved.'}))
    .then (() => {
      let db = new Database ().db
      db.one (`
        SELECT
        CASE
        WHEN
                COUNT((SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)) > 0
        THEN
                (SELECT apikeys.webhook_url AS url FROM numbers LEFT JOIN apikeys ON apikeys.id = numbers.apikey_id WHERE numbers.number = $[to] LIMIT 1)
        ELSE
                NULL
        END AS url
      `, {
        to: receivedMessage.to
      })
      .then (result => {
        if (result.url && result.url !== null) {
          Request.post (result.url + '/email', {
            to: receivedMessage.to,
            from: receivedMessage.from
          })
        }
      })
    })
    .catch (error => {
      Log.error ('Error sending message, \'' + error.message + '\'')
      res.json ({success: false, errors: error})
    })
  }

  static saveEmail (to: string, from: string, subject: string, message: string, timestamp: string, attachments: MailAttachment[]) {
    Log.debug ('Saving message to ' + to + ' from ' + from)

    let db = new Database ().db
    return db.one ('INSERT INTO conversations (type, outbound_number, inbound_number, subject, content, message_count, created_at) VALUES(\'email\',$[from], $[to], $[subject], $[message], 0, NOW()) RETURNING id', {
      to: to,
      from: from,
      subject: subject,
      message: message,
      timestamp: timestamp
    }).then (result => {
      if (attachments) {
        Log.debug ('Email has attachments')

        // init s3 client
        aws.config.update ({accessKeyId: Config.aws.key, secretAccessKey: Config.aws.secret, signatureVersion: 'v4'})
        let s3Client = new aws.S3 ()

        // get the date and time as string YYYMMDD/HHMMSS
        let date = new Date
        let dateStr = [
          [date.getFullYear ().toString (), ('0' + (date.getMonth () + 1)).slice (-2), ('0' + date.getDate ()).slice (-2)].join (''),
          [('0' + date.getHours ()).slice (-2), ('0' + date.getMinutes ()).slice (-2), ('0' + date.getSeconds ()).slice (-2)].join ('')
        ].join ('/')

        for (let file of attachments) {
          let remotePath = 'emails/' + from + '/' + dateStr + '-' + file.filename
          s3Client.putObject ({
            Bucket: Config.bucket,
            Key: remotePath,
            Body: file.content,
            ACL: 'public-read'
          }, (err, data) => {
            if (err) {
              Log.error ('filed to upload ' + file.filename)
              return
            }

            db.none (
              'INSERT INTO conversation_attachments (conversation_id, filename, url) VALUES (${conversation_id}, ${filename}, ${url})',
              {
                'conversation_id': result.id,
                'filename': file.filename,
                'url': 'https://s3.eu-west-2.amazonaws.com/'.concat (Config.bucket, '/', remotePath)
              }
            ).then (() => {
              //@todo do something
            })
            .catch ((err) => Log.error ('Failed to insert attachment'))
          })
        }
      }
    })
  }

  static saveMessage (to: string, from: string, message: string, timestamp: string) {
    Log.debug ('Saving message to ' + to + ' from ' + from)

    let db = new Database ().db
    return db.one ('INSERT INTO conversations (type, outbound_number, inbound_number, content, message_count, created_at) VALUES(\'message\',$[from], $[to], $[message], 0, $[timestamp]) RETURNING id', {
      to: to,
      from: from,
      message: message,
      timestamp: timestamp
    })
  }

}