import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TgbotController } from './tgbot/tgbot.controller';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const botApp = await NestFactory.createApplicationContext(AppModule);
  const tgBot = await botApp.get(TgbotController);
  tgBot.start();

  // const app = await NestFactory.create(AppModule, {
  //   cors: {
  //     allowedHeaders: '*',
  //     exposedHeaders: '*',
  //   },
  // });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  // await app.listen(3339);
}
bootstrap();
