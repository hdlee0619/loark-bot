import { Injectable, Logger } from '@nestjs/common';
import { Client, EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';
import { ServerService } from '@/server/server.service';
import { ConfigService } from '@/config/config.service';
import { SetPrefixHandler } from '@/command/admin/set-prefix/set-prefix.handler';
import { PingHandler } from '@/command/ping/ping.handler';
import { SetChannelHandler } from '@/command/admin/set-channel/set-channel.handler';
import { UnsetChannelHandler } from '@/command/admin/unset-channel/unset-channel.handdler';

@Injectable()
export class CommandService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    private readonly serverService: ServerService,
    private readonly configService: ConfigService,

    // command for admin
    private readonly setPrefixHandler: SetPrefixHandler,
    private readonly setChannelHandler: SetChannelHandler,
    private readonly unsetChannelHandler: UnsetChannelHandler,

    // command for user
    private readonly pingHandler: PingHandler,
  ) {
    this.commandHandlers = [
      setPrefixHandler,
      setChannelHandler,
      unsetChannelHandler,
      pingHandler,
    ];
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

    // Check for custom prefix
    const serverPrefix = await this.serverService.getServerPrefix(
      message.guildId,
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
      if (
        !(await this.serverService.isChannelAllowed(
          message.guild.id,
          message.channel.id,
        ))
      ) {
        return;
      }
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
