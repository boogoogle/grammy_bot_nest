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
    // console.log(tgAccount, 'tgAccount from');
    const wallets = await this.wallet.getWallets(tgAccountId);

    ctx.reply(
      `
    🦄 DoctorBot ⬩ Website (https://unibot.app/) ⬩ Tutorials (https://learn.unibot.app/) 🦄
    Gas: ${_ethInfo.gas}   Block: ${_ethInfo.blockNumber}   ETH: $${_ethInfo.quote}


    ═══ Your Wallets ═══
    ▰ Wallet-w1 (https://etherscan.io/address/0x34E8002191B7EdC6ee368dec78CA7C18182a5D4D) ▰
    
    `,
      {
        reply_markup: menu,
      },
    );
  }
}
