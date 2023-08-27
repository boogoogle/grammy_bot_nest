import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [Web3Module, PrismaModule],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
