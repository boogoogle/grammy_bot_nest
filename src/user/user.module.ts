import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [Web3Module],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
