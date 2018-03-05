import { ApiKey } from './app/types/api-key'

export class Config {
  static port = Number(process.env.PORT || 7890);
  static baseWebhook: string = (process.env.BASE_WEBHOOK || undefined); // Must be changed to the base webhook url
  static databaseConnection: string = (process.env.DATABASE_CONNECTION || 'postgres://smshub:smshub@localhost/smshub');

  static nexmo: ApiKey = {
    key: (process.env.NEXMO_KEY || undefined),
    secret: (process.env.NEXMO_SECRET || undefined)
  };

  static mandrill: ApiKey = {
    key: (process.env.MANDRILL_KEY || undefined)
  };

  static aws: ApiKey = {
    key: (process.env.AWS_KEY || undefined),
    secret: (process.env.AWS_SECRET || undefined)
  };

  static bucket: string = (process.env.AWS_BUCKET || undefined)
}
