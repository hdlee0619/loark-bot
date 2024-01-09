import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';

import { ConfigService } from '@/config/config.service';
import { ServerService } from '@/server/server.service';

@Injectable()
export class SetPrefixHandler implements ICommandHandler {
  constructor(
    private readonly serverService: ServerService,
    private readonly configService: ConfigService,
  ) {}

  name = `${this.configService.adminPrefix} set prefix <prefix>`;
  description =
    'allow server admin to define a custom prefix for user commands';
  regex = new RegExp(`^${this.configService.adminPrefix} set prefix (.*)`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const prefix = message.content.match(this.regex)[1];

    const savedPrefix = await this.serverService.setServerPrefix(
      message.guild.id,
      prefix,
    );

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`Prefix를 \`${savedPrefix}\` 로 변경 완료했습니다.`);
    await message.reply({ embeds: [embed] });
  }
}
