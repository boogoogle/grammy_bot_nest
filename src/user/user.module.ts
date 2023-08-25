import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Web3Module } from 'src/web3/web3.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [Web3Module, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
