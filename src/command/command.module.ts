import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CommandService } from '@/command/command.service';
import { ServerModule } from '@/server/server.module';
import { ConfigModule } from '@/config/config.module';
import { SetPrefixHandler } from '@/command/admin/set-prefix/set-prefix.handler';
import { SetChannelHandler } from '@/command/admin/set-channel/set-channel.handler';
import { UnsetChannelHandler } from '@/command/admin/unset-channel/unset-channel.handdler';
import { StatusHandler } from '@/command/status/status.handler';
import { HelpHandler } from '@/command/help/help.handler';
import { PingHandler } from '@/command/ping/ping.handler';
import { SetAdminRoleHandler } from '@/command/admin/set-admin-role/set-admin-role.handler';
import { ConfigService } from '@/config/config.service';
import { CharactersHandler } from '@/command/lostark/character/characters.handler';

const config = new ConfigService();

@Module({
  imports: [
    HttpModule.register({
      baseURL: config.lostArkUrl,
      headers: {
        Authorization: `Bearer ${config.lostArkApiKey}`,
        Accept: 'application/json',
      },
    }),
    ServerModule,
    ConfigModule,
  ],
  providers: [
    CommandService,
    SetPrefixHandler,
    SetChannelHandler,
    UnsetChannelHandler,
    SetAdminRoleHandler,
    StatusHandler,
    HelpHandler,
    PingHandler,
    CharactersHandler,
  ],
  exports: [CommandService],
})
export class CommandModule {}
