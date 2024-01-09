import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@/config/config.service';
import { DiscordService } from '@/discord/discord.service';
import { DiscordModule } from '@/discord/discord.module';
import { ServerModule } from '@/server/server.module';

const config = new ConfigService();
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURL),
    ConfigModule,
    DiscordModule,
    ServerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, DiscordService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.NODE_ENV === 'development';

  configure() {
    mongoose.set('debug', this.isDev);
  }
}
