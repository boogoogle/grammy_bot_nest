import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';
import { UserModule } from 'src/user/user.module';
import { Web3Module } from 'src/web3/web3.module';
import { TgbotController } from './tgbot.controller';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [UserModule, Web3Module, WalletModule],
  providers: [TgbotService],
  controllers: [TgbotController],
})
export class TgbotModule {}
