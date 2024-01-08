import { Test, TestingModule } from '@nestjs/testing';

import { DiscordService } from '@/discord/discord.service';
import { ConfigService } from '@/config/config.service';

describe('DiscordService', () => {
  let discordService: DiscordService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordService, ConfigService],
    }).compile();

    discordService = module.get<DiscordService>(DiscordService);
    configService = new ConfigService();
  });

  it('should be defined', () => {
    expect(discordService).toBeDefined();
    expect(configService).toBeDefined();
  });
});
