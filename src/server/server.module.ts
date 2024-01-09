import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServerService } from '@/server/server.service';
import { Server, ServerSchema } from '@/server/schema/server.schema';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    ConfigModule,
  ],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
