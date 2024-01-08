import { Injectable, Logger } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

import { ConfigService } from '@/config/config.service';

@Injectable()
export class DiscordService {
  client: Client;
  isReady: boolean;

  constructor(private readonly config: ConfigService) {}

  connect(): Client {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client
      .login(this.config.discordToken)
      .then(() => Logger.log('Success Login'))
      .catch((error) => Logger.error(`Fail with message:${error}`));

    this.client.once('ready', () => {
      Logger.log(`Discord bot connected`);
      this.isReady = true;
    });

    return this.client;
  }
}
