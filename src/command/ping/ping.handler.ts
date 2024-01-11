import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';

@Injectable()
export class PingHandler implements ICommandHandler {
  name = 'ping';
  regex = new RegExp(`^ping$`, 'i');

  test(content: string) {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const embed = new EmbedBuilder().setColor('Green').setDescription('pong!');
    await message.reply({ embeds: [embed] });
  }
}
