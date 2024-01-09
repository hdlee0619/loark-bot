import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DiscordService } from '@/discord/discord.service';
import { CommandService } from '@/command/command.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const discordService = app.get(DiscordService);
  const commandService = app.get(CommandService);

  await app.listen(3000, async () => {
    const client = discordService.connect();
    commandService.register(client);
  });
}

bootstrap();
