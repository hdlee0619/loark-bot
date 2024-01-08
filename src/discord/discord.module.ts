import { Module } from '@nestjs/common';

import { ConfigService } from '@/config/config.service';
import { DiscordService } from '@/discord/discord.service';

@Module({
  providers: [DiscordService, ConfigService],
  exports: [DiscordService],
})
export class DiscordModule {}
