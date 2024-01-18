import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';
import { ServerService } from '@/server/server.service';

@Injectable()
export class HelpHandler implements ICommandHandler {
  constructor(private readonly serverService: ServerService) {}

  name = 'help';
  regex = new RegExp('^help', 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const prefix = await this.serverService.getServerPrefix(message.guild.id);

    const userEmbed = new EmbedBuilder()
      .setColor('Green')
      .setDescription('📝 로아크 봇 사용가능 명령어')
      .addFields([
        {
          name: `${prefix}help`,
          value: 'display this message',
        },
        {
          name: `${prefix}ping`,
          value: 'reply `pong!`',
        },
      ]);

    const adminEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('로아크 봇 관리자용 사용 명령어')
      .addFields([
        {
          name: `${prefix}help`,
          value: 'display this message',
        },
        {
          name: `${prefix}ping`,
          value: 'reply `pong!`',
        },
      ]);

    await message.reply({ embeds: [userEmbed, adminEmbed] });
  }
}
