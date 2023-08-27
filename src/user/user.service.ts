import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Web3Service } from 'src/web3/web3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private web3: Web3Service,
    private wallet: WalletService,
  ) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        tgAccountId: dto.tgAccountId,
      },
    });
  }

  async findOne(dto: CreateUserDto) {
    return this.prisma.user.findUnique({
      where: {
        tgAccountId: dto.tgAccountId,
      },
    });
  }

  async deleteOne(dto: CreateUserDto) {
    return this.prisma.user.delete({
      where: {
        tgAccountId: dto.tgAccountId,
      },
    });
  }

  async register(dto: RegisterUserDto) {
    const _wallets = await this.web3.createWallet();

    // 因为createMany 不支持SQLite,这里先分别create
    const user = await this.prisma.user.create({
      data: {
        tgAccountId: dto.tgAccountId,
      },
    });

    _wallets.forEach((item) => {
      item.tgAccountId = dto.tgAccountId;
    });

    await this.wallet.insertWallets(_wallets);

    return {
      user: user.tgUsername,
      wallets: _wallets.map((_w) => _w.address),
    };
  }
  async test() {
    return await this.web3.getCurrentETHInfo();
  }
}
