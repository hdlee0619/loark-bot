import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';

import { ICommandHandler } from '@/command/commandHandler.interface';
import NoticesDto from '@/command/lostark/news/notices.dto';
import dayjs from 'dayjs';
import dayjsConfig from '@/utils/dayjs.config';

@Injectable()
export class NoticesHandler implements ICommandHandler {
  constructor(private readonly httpService: HttpService) {}

  name = '공지사항';
  regex = new RegExp(`^공지사항$`, 'i');

  test(content: string) {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const notices$ = this.httpService
      .get<NoticesDto[]>('/news/notices')
      .pipe(map((response) => response.data.slice(0, 5)))
      .pipe(
        catchError((err) => {
          throw new Error(err);
        }),
      );

    notices$.subscribe(async (response) => {
      const embeds: EmbedBuilder[] = [];

      response.forEach((item) => {
        const embed = new EmbedBuilder().setFields([
          { name: item.Type, value: item.Title, inline: true },
          {
            name: '날짜',
            value: dayjsConfig(item.Date).format('YYYY-MM-DD HH:mm'),
            inline: false,
          },
          { name: '\u200b', value: item.Link, inline: false },
        ]);

        embeds.push(embed);
      });

      await message.reply({ embeds: embeds });
    });
  }
}
