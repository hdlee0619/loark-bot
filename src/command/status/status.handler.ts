import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';
import { ICommandHandler } from '@/command/commandHandler.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../../package.json').version;

@Injectable()
export class StatusHandler implements ICommandHandler {
  name = 'status';
  regex = new RegExp(`^status$`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const embed = new EmbedBuilder().setColor('Green').addFields([
      {
        name: 'Version',
        value: version,
      },
      {
        name: 'Statistics',
        value: `I'm in ${message.client.guilds.cache.size} servers.`,
      },
      {
        name: 'Status',
        value: `
**Uptime** ${this.formatUptime()}
:white_check_mark: Bot 
            `,
      },
    ]);
    await message.reply({ embeds: [embed] });
  }

  formatUptime(): string {
    const time = process.uptime();

    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
}
