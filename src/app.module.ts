import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TgbotModule } from './tgbot/tgbot.module';

@Module({
  imports: [TgbotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
