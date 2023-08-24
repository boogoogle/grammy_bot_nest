import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TgbotService } from './tgbot/tgbot.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const tgBot = await app.get(TgbotService);
  tgBot.start();

  // await app.listen(3011);
}
bootstrap();
