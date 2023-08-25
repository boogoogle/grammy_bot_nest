import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Web3Service } from 'src/web3/web3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletCreateWithoutUserInput } from 'prisma';

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private web3: Web3Service,
  ) {}

  async register(dto: RegisterUserDto) {
    const _wallets = await this.web3.createWallet();

    // 因为createMany 不支持SQLite,这里先分别create
    const user = await this.prisma.user.create({
      data: {
        tgUsername: dto.tgUsername || '',
        tgAccount: dto.tgUsername || '',
      },
    });

    _wallets.forEach(async (_w) => {
      await this.prisma.wallet.create({
        data: {
          userId: user.id,
          ..._w,
        },
      });
    });

    return {
      user: user.tgUsername,
      wallets: _wallets.map((_w) => _w.address),
    };
  }
}
