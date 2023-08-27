import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Web3Service } from 'src/web3/web3.service';
import { IWallet } from 'types';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService, private web3: Web3Service) {}

  async getWallets(tgAccountId?: number) {
    const _wallets = await this.prisma.wallet.findMany({
      where: {
        tgAccountId: tgAccountId,
      },
    });
    return _wallets;
  }

  async deleteWalletsByTgAccountId(tgAccountId?: number) {
    const _wallets = await this.prisma.wallet.deleteMany({
      where: {
        tgAccountId,
      },
    });
    return _wallets;
  }

  async insertWallets(_wallets: Array<IWallet>) {
    const _records = [];

    for (let i = 0; i < _wallets.length; i++) {
      const _w = _wallets[i];
      const _r = await this.prisma.wallet.create({
        data: {
          address: _w.address,
          privateKey: _w.privateKey,
          mnemonic: _w.mnemonic,
          tgAccountId: Number(_w.tgAccountId),
        },
      });
      _records.push(_r);
    }
    return _records;
  }
}
