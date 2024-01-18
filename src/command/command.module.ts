import { Module } from '@nestjs/common';

import { CommandService } from '@/command/command.service';
import { ServerModule } from '@/server/server.module';
import { ConfigModule } from '@/config/config.module';
import { SetPrefixHandler } from '@/command/admin/set-prefix/set-prefix.handler';
import { SetChannelHandler } from '@/command/admin/set-channel/set-channel.handler';
import { UnsetChannelHandler } from '@/command/admin/unset-channel/unset-channel.handdler';
import { HelpHandler } from '@/command/help/help.handler';
import { PingHandler } from '@/command/ping/ping.handler';

@Module({
  imports: [ServerModule, ConfigModule],
  providers: [
    CommandService,
    SetPrefixHandler,
    SetChannelHandler,
    UnsetChannelHandler,
    HelpHandler,
    PingHandler,
  ],
  exports: [CommandService],
})
export class CommandModule {}
