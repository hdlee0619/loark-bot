import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';

import { ICommandHandler } from '@/command/commandHandler.interface';
import { ConfigService } from '@/config/config.service';
import { ServerService } from '@/server/server.service';

@Injectable()
export class HelpHandler implements ICommandHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly serverService: ServerService,
  ) {}

  name = 'help';
  regex = new RegExp('^help', 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const adminPrefix = this.configService.adminPrefix;
    const prefix = await this.serverService.getServerPrefix(message.guild.id);
    const hasAdminRole = await this.serverService.hasAdminRoleGuard(
      message,
      message.guild,
      message.author.id,
    );
    const spacer = { name: '** **', value: '\u200b' };

    const adminEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setDescription('📝 로아크 봇 관리자용 명령어')
      .addFields([
        { name: '관리자 Prefix', value: `<${adminPrefix}>` },
        spacer,
        {
          name: '현재 사용자 prefix',
          value: `<${prefix}>`,
        },
        spacer,
        {
          name: '봇 채널 설정',
          value: `${adminPrefix} set channel`,
        },
        spacer,
        { name: '봇 채널 삭제', value: `${adminPrefix} unset channel` },
        spacer,
        {
          name: '봇 관리자 역할 설정',
          value: `${adminPrefix} set admin role @role`,
        },
      ]);

    const userEmbed = new EmbedBuilder()
      .setColor('Blue')
      .setDescription('📝 로아크 봇 사용가능 명령어')
      .addFields([
        {
          name: `${prefix} help`,
          value: '로아크 봇 사용가능 명령어 출력',
        },
        spacer,
        {
          name: `${prefix} ping`,
          value: 'reply `pong!`',
        },
        spacer,
        {
          name: `${prefix} 보유캐릭터 <캐릭터 닉네임>`,
          value: '로스트아크 보유 캐릭터 아이템레벨 높은 순 6개 출력',
        },
        spacer,
        {
          name: `${prefix} status`,
          value: '로아크 봇 상태 확인',
        },
      ]);

    hasAdminRole
      ? await message.reply({ embeds: [adminEmbed, userEmbed] })
      : await message.reply({ embeds: [userEmbed] });
  }
}
