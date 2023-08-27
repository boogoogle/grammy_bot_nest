import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { UserService } from 'src/user/user.service';
import { MyContext } from './types';
import { Web3Service } from 'src/web3/web3.service';
import { IETH_Info } from 'types';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TgbotService {
  private bot: Bot;
  private msgId: string | number;
  private menu: Menu;

  constructor(
    private user: UserService,
    private web3: Web3Service,
    private wallet: WalletService,
  ) {}

  async processMenuCMD(ctx: MyContext, menu: Menu) {
    const _ethInfo: IETH_Info = await this.web3.getCurrentETHInfo();
    const tgAccountId = ctx.msg.from.id;

    const baseInfo = await this.user.hello({ tgAccountId });

    if (baseInfo.wallets) {
      // 分别查询钱包的余额，组装scan地址
    }

    ctx.reply(
      `
    🦄 DoctorBot ⬩ [Website](https://unibot.app/) ⬩ [Tutorials](https://learn.unibot.app/) 🦄
    Gas: \`${_ethInfo.gas}\`   Block: \`${_ethInfo.blockNumber}\`   ETH: \`$${_ethInfo.quote}\`


    ═══ Your Wallets ═══
    ▰ [Wallet-w1](https://etherscan.io/address/${baseInfo.wallets[0]}) ▰
    ▰ [Wallet-w2](https://etherscan.io/address/${baseInfo.wallets[1]}) ▰
    ▰ [Wallet-w3](https://etherscan.io/address/${baseInfo.wallets[2]}) ▰
    
    `,
      {
        reply_markup: menu,
        parse_mode: 'Markdown',
      },
    );
  }
}
