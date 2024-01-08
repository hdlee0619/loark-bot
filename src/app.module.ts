import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@/config/config.service';

import { DiscordService } from '@/discord/discord.service';
import { DiscordModule } from '@/discord/discord.module';

@Module({
  imports: [ConfigModule, DiscordModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, DiscordService],
})
export class AppModule {}
