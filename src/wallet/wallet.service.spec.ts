import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Web3Module } from 'src/web3/web3.module';
import { IWallet } from 'types';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

describe('WalletService', () => {
  let service: WalletService;
  let userService: UserService;

  let tgAccountId = 100000021;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        Web3Module,
        PrismaModule,
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [WalletService],
    }).compile();

    service = module.get<WalletService>(WalletService);
    userService = module.get<UserService>(UserService);

    const user = await userService.findOne({ tgAccountId });
    console.log(user, '--user');

    if (user) {
      await userService.deleteOne({ tgAccountId });
      await service.deleteWalletsByTgAccountId(tgAccountId);
    }

    await userService.create({ tgAccountId });
  });

  it('should insert wallets successful', async () => {
    const _wallets: Array<IWallet> = [
      {
        address: 'test1111',
        privateKey: 'private333333444',
        mnemonic: 'rember yourself',
        tgAccountId,
      },
    ];
    const rst = await service.insertWallets(_wallets);
    expect(rst.length === 1);
    expect(rst[0].address === 'test1111');
  });
});
