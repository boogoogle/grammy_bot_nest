import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';

@Module({
  providers: [TgbotService],
})
export class TgbotModule {}
