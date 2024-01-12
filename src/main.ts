import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DiscordService } from '@/discord/discord.service';
import { CommandService } from '@/command/command.service';
import { ConfigService } from '@/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const discordService = app.get(DiscordService);
  const commandService = app.get(CommandService);

  await app.listen(config.port, async () => {
    const client = discordService.connect();
    commandService.register(client);
  });
}

bootstrap();
