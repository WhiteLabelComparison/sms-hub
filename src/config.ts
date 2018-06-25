import { ApiKey } from './app/types/api-key';

export class Config {
  static port: number = Number(process.env.PORT || 7890);
  static baseWebhook: string = (process.env.BASE_WEBHOOK || undefined); // Must be changed to the base webhook url
  static databaseConnection: string = (process.env.DATABASE_CONNECTION || 'postgres://smshub:smshub@localhost/smshub');

  static nexmo: ApiKey = {
    key: process.env.NEXMO_KEY,
    secret: process.env.NEXMO_SECRET,
  };

  static mandrill: ApiKey = {
    key: process.env.MANDRILL_KEY,
  };

  static aws: ApiKey = {
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
  };

  static bucket: string = process.env.AWS_BUCKET || 'smshub';
}
