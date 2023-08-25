import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';
import { UserModule } from 'src/user/user.module';
import { Web3Module } from 'src/web3/web3.module';
import { TgbotController } from './tgbot.controller';

@Module({
  imports: [UserModule, Web3Module],
  providers: [TgbotService],
  controllers: [TgbotController],
})
export class TgbotModule {}
