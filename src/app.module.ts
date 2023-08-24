import { Module } from '@nestjs/common';
import { TgbotModule } from './tgbot/tgbot.module';
import { RouterModule } from '@nestjs/core';
import { WalletModule } from './wallet/wallet.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true, // disable looking for .env file; only use runtime environment
    }),
    RouterModule.register([
      {
        path: 'api',
        children: [UserModule],
      },
    ]),
    UserModule,
    WalletModule,
    TgbotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
