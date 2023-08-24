import { Module } from '@nestjs/common';
import { TgbotModule } from './tgbot/tgbot.module';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';

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
    TgbotModule,
    Web3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
