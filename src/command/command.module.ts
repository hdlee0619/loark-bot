import { Module } from '@nestjs/common';

import { CommandService } from '@/command/command.service';
import { ServerModule } from '@/server/server.module';
import { ConfigModule } from '@/config/config.module';
import { SetPrefixHandler } from '@/command/admin/set-prefix/set-prefix.handler';

@Module({
  imports: [ServerModule, ConfigModule],
  providers: [CommandService, SetPrefixHandler],
  exports: [CommandService],
})
export class CommandModule {}
