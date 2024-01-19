import { Injectable, Logger } from '@nestjs/common';
import { Message, EmbedBuilder } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';
import { ServerService } from '@/server/server.service';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class SetAdminRoleHandler implements ICommandHandler {
  constructor(
    private readonly serverService: ServerService,
    private readonly configService: ConfigService,
  ) {}
  name = `${this.configService.adminPrefix} set admin role <@role>`;
  description =
    'set role with admin permissions on the bot for the current server';
  regex = new RegExp(
    `^${this.configService.adminPrefix} SET ADMIN role <@&(.+)>`,
    'i',
  );

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const roleId = message.content.match(this.regex)[1];

    Logger.debug(`captured role id ${roleId}`, 'setAdminRoleHandler');
    try {
      await this.serverService.setAdminRole(
        message,
        message.guild,
        message.author.id,
        roleId,
      );
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`<@&${roleId}> is now the admin role`);

      await message.reply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Failed to set the admin role')
        .setDescription(error.message);

      await message.reply({ embeds: [errorEmbed] });
    }
  }
}
