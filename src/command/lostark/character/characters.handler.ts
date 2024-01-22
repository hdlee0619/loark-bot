import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';

import { ICommandHandler } from '@/command/commandHandler.interface';
import CharactersDto from '@/command/lostark/character/characters.dto';

@Injectable()
export class CharactersHandler implements ICommandHandler {
  constructor(private readonly httpService: HttpService) {}

  name = '보유캐릭터';
  regex = new RegExp(`^보유캐릭터`, 'i');

  test(content: string) {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const characterName = message.content
      .split(' ')
      .filter((item) => item !== this.name)[0];

    const characters$ = this.httpService
      .get<CharactersDto[]>(`/characters/${characterName}/siblings`)
      .pipe(
        map((response) =>
          // ItemMaxLevel 높은 순서대로 정렬 후 6개 return
          response.data
            .sort(
              (a, b) =>
                parseFloat(b.ItemMaxLevel.replace(/,/g, '')) -
                parseFloat(a.ItemMaxLevel.replace(/,/g, '')),
            )
            .slice(0, 6),
        ),
      )
      .pipe(
        catchError((err) => {
          throw new Error(err);
        }),
      );

    characters$.subscribe(async (response) => {
      const embeds: EmbedBuilder[] = [];

      response.forEach((item) => {
        const embed = new EmbedBuilder().setColor('Green').setFields(
          { name: '서버', value: item.ServerName, inline: true },
          { name: '캐릭터명', value: item.CharacterName, inline: true },
          {
            name: '레벨',
            value: item.CharacterLevel.toString(),
            inline: true,
          },
          { name: '클래스', value: item.CharacterClassName, inline: true },
          { name: '아이템레벨', value: item.ItemMaxLevel, inline: true },
        );

        embeds.push(embed);
      });

      await message.reply({ embeds: embeds });
    });
  }
}
