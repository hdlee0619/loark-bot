import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  Message,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import dayjsConfig from '@/utils/dayjs.config';

import { ICommandHandler } from '@/command/commandHandler.interface';
import EventDto from '@/command/lostark/news/events.dto';

@Injectable()
export class EventsHandler implements ICommandHandler {
  constructor(private readonly httpService: HttpService) {}

  name = '이벤트';
  regex = new RegExp(`^이벤트$`, 'i');

  test(content: string) {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const maxEmbeds = 5;

    const events$ = this.httpService
      .get<EventDto[]>('/news/events')
      .pipe(map((response) => response.data.slice(0, maxEmbeds)))
      .pipe(
        catchError((err) => {
          throw new Error(err);
        }),
      );

    events$.subscribe(async (response) => {
      response.forEach((item) => {
        const startDate = dayjsConfig(item.StartDate).format(
          'YYYY-MM-DD HH:mm',
        );
        const endDate = dayjsConfig(item.EndDate).format('YYYY-MM-DD HH:mm');

        const embed = item.RewardDate
          ? new EmbedBuilder()
              .setFields([
                { name: item.Title, value: '\u200b', inline: false },
                {
                  name: '기간',
                  value: `${startDate} ~ ${endDate}`,
                  inline: false,
                },
                {
                  name: '보상 수령 기간',
                  value: `${startDate} ~ ${dayjsConfig(item.RewardDate).format(
                    'YYYY-MM-DD HH:mm',
                  )}`,
                },
              ])
              .setImage(item.Thumbnail)
          : new EmbedBuilder()
              .setFields([
                { name: item.Title, value: '\u200b', inline: false },
                {
                  name: '기간',
                  value: `${startDate} ~ ${endDate}`,
                  inline: false,
                },
              ])
              .setImage(item.Thumbnail);

        const link = new ButtonBuilder()
          .setLabel('자세히 보기')
          .setStyle(ButtonStyle.Link)
          .setURL(item.Link);

        const buttons: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            link,
          ),
        ];

        message.channel.send({ embeds: [embed], components: buttons });
      });
    });
  }
}
