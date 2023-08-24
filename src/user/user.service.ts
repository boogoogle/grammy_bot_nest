import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class UserService {
  constructor(private config: ConfigService, private web3: Web3Service) {}

  async register(dto: RegisterUserDto) {
    const wallets = await this.web3.createWallet();

    const _d = {
      tgUsername: dto.tgUsername,
      wallets,
    };

    return _d;

    return this.config.get('DATABASE_URL');
  }
}
