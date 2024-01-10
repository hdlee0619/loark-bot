import { Injectable, Logger } from '@nestjs/common';
import { Client, EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';
import { ServerService } from '@/server/server.service';
import { ConfigService } from '@/config/config.service';
import { SetPrefixHandler } from '@/command/admin/set-prefix/set-prefix.handler';

@Injectable()
export class CommandService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    private readonly serverService: ServerService,
    private readonly configService: ConfigService,

    private readonly setPrefixHandler: SetPrefixHandler,
  ) {
    this.commandHandlers = [setPrefixHandler];
  }

  register(client: Client) {
    for (const command of this.commandHandlers) {
      Logger.log(
        `${command.name} registered => ${
          command.regex ?? command.description ?? '?'
        }`,
        'CommandExplorer',
      );
    }

    client.on('messageCreate', async (message) => {
      try {
        await this.messageHandler(message);
      } catch (error) {
        Logger.error(error.message, error.stack);
        const errorEmbed = new EmbedBuilder()
          .setColor('Red')
          .setDescription(error.message);

        await message.reply({ embeds: [errorEmbed] });
      }
    });
  }

  async messageHandler(message: Message) {
    if (message.author.bot) return;
    const { content } = message;

    // Test for custom prefix
    const serverPrefix = await this.serverService.getServerPrefix(
      message.guild.id,
    );
    const prefixRegexp = new RegExp(
      `^(${this.escapePrefixForRegexp(
        this.configService.adminPrefix,
      )}|${this.escapePrefixForRegexp(serverPrefix)})`,
      'i',
    );
    if (!prefixRegexp.test(message.content)) return;
    const serverPrefixRegexp = new RegExp(
      `^${this.escapePrefixForRegexp(serverPrefix)}`,
      'i',
    );
    if (serverPrefixRegexp.test(message.content)) {
      message.content = message.content.replace(serverPrefixRegexp, '').trim();
    }

    for (const handler of this.commandHandlers) {
      if (handler.test(message.content)) {
        try {
          Logger.debug(`executing command [${handler.name}] => ${content}`);
          await handler.execute(message);
          return;
        } catch (error) {
          Logger.error(error.message, error.stack);
          const errorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(error.message);
          await message.reply({ embeds: [errorEmbed] });
        }
      }
    }
  }

  private escapePrefixForRegexp(serverPrefix: string): string {
    const char = serverPrefix[0];
    if ('./+\\*!?)([]{}^$'.split('').includes(char)) return `\\${serverPrefix}`;
    return serverPrefix;
  }
}
