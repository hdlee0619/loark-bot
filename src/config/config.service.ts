import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as path from 'path';

@Injectable()
export class ConfigService {
  public readonly discordToken: string;
  public readonly discordClientId: string;

  public readonly port: number;
  public readonly mongoURL: string;

  public readonly adminPrefix: string;
  public readonly defaultPrefix: string;

  public readonly lostArkUrl: string;
  public readonly lostArkApiKey: string;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      config({
        path: path.resolve('.env.development'),
      });
    }

    this.discordToken = process.env.DISCORD_API_TOKEN;
    this.discordClientId = process.env.DISCORD_CLIENT_ID;
    this.port = parseInt(process.env.PORT);
    this.mongoURL = process.env.MONGO_URL;
    this.adminPrefix = 'admin';
    this.defaultPrefix = '!';
    this.lostArkUrl = process.env.LOST_ARK_URL;
    this.lostArkApiKey = process.env.LOST_ARK_API_KEY;
  }
}
