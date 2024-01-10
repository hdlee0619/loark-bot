import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as path from 'path';

@Injectable()
export class ConfigService {
  public readonly discordToken: string;
  public readonly discordClientId: string;

  public readonly mongoURL: string;

  public readonly adminPrefix: string;
  public readonly defaultPrefix: string;

  constructor() {
    config({
      path: path.resolve(
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      ),
    });

    this.discordToken = process.env.DISCORD_API_TOKEN;
    this.discordClientId = process.env.DISCORD_CLIENT_ID;
    this.mongoURL = process.env.MONGO_URL;
    this.adminPrefix = 'admin';
    this.defaultPrefix = '!';
  }
}
