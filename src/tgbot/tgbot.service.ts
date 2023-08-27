import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { UserService } from 'src/user/user.service';
import { MyContext } from './types';
import { Web3Service } from 'src/web3/web3.service';
import { IETH_Info } from 'types';
import { WalletService } from 'src/wallet/wallet.service';
import { TgbotController } from './tgbot.controller';
import { checkUsername, checkAddress } from './helpers';

import {
  Address_Question,
  ENTER_TOKEN_ADDRESS,
  Username_Question,
} from './constants';

let memoBaseInfo = { user: '', wallets: [] };

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

    if (!memoBaseInfo || !memoBaseInfo.user) {
      memoBaseInfo = await this.user.hello({ tgAccountId });
    }
    const baseInfo = memoBaseInfo;

    if (baseInfo.wallets) {
      // 分别查询钱包的余额，组装scan地址
    }

    ctx.reply(
      `
    🦄 DoctorBot🦄
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

  processMessageText(ctx: MyContext) {
    if (ctx.msg.reply_to_message?.text === Username_Question) {
      const _username = ctx.msg.text;
      if (checkUsername(_username)) {
        ctx.session.username = _username;
        ctx.reply(Address_Question, {
          reply_markup: {
            force_reply: true,
          },
        });
        ctx.deleteMessage();
      } else {
        ctx.api.deleteMessage(ctx.chat.id, ctx.msg.reply_to_message.message_id);
        ctx.deleteMessage();
        ctx.reply(Username_Question, {
          reply_markup: {
            force_reply: true,
          },
        });
        return;
      }
    }

    if (ctx.msg.reply_to_message?.text === Address_Question) {
      const _address = ctx.msg.text;
      if (checkAddress(_address)) {
        ctx.session.address = _address;
        ctx.deleteMessage();

        ctx.api.editMessageText(ctx.chat.id, this.msgId as number, 'Congs!!!', {
          reply_markup: this.menu,
        });
        ctx.reply(`✔${ctx.session.username}: 🏠${ctx.session.address}`);

        return;
      } else {
        ctx.api.deleteMessage(ctx.chat.id, ctx.msg.reply_to_message.message_id);
        ctx.deleteMessage();
        ctx.reply(Address_Question, {
          reply_markup: {
            force_reply: true,
          },
        });

        ctx.api.editMessageText(ctx.chat.id, this.msgId as number, 'congs', {
          reply_markup: this.menu,
        });
      }
    }

    if (ctx.msg.reply_to_message?.text === ENTER_TOKEN_ADDRESS) {
      const _address = ctx.msg.text;
      if (checkAddress(_address)) {
        ctx.session.tradingTokenAddress = _address;
        // ctx.deleteMessage();

        // trading via Uniswap

        return;
      } else {
        ctx.api.deleteMessage(ctx.chat.id, ctx.msg.reply_to_message.message_id);
        ctx.deleteMessage();
        ctx.reply(Address_Question, {
          reply_markup: {
            force_reply: true,
          },
        });

        ctx.api.editMessageText(ctx.chat.id, this.msgId as number, 'congs', {
          reply_markup: this.menu,
        });
      }
    }
  }

  createBuyInterface(ctrl: TgbotController) {
    const buyInterface = new Menu<MyContext>('buy-interface-identifier', {
      autoAnswer: false,
    })
      .back('↩ Menu', async (ctx: MyContext) => {
        // do sth. 撤回那条消息
      })
      .text('❌ Close', async (ctx: MyContext) => {
        ctx.menu.back();
        // ctx.api.deleteMessage(ctx.chat.id, ctx.msg.reply_to_message.message_id);
        ctx.deleteMessage();
      })
      .row()
      .text('=== Select Wallets ===', async (ctx: MyContext) => {
        // do sth.
      })
      .row()
      .text(
        (ctx: MyContext) => {
          return ctx.session.selectedWallet === 'w1' ? 'w1 ✅' : 'w1';
        },
        (ctx: MyContext) => {
          ctx.session.selectedWallet = 'w1';
          ctx.menu.update();
        },
      )
      .text(
        (ctx: MyContext) => {
          return ctx.session.selectedWallet === 'w2' ? 'w2 ✅' : 'w2';
        },
        (ctx: MyContext) => {
          ctx.session.selectedWallet = 'w2';
          ctx.menu.update();
        },
      )
      .text(
        (ctx: MyContext) => {
          return ctx.session.selectedWallet === 'w3' ? 'w3 ✅' : 'w3';
          // do sth.
        },
        (ctx: MyContext) => {
          ctx.session.selectedWallet = 'w3';
          ctx.menu.update();
        },
      )
      .row()
      .text('=== Select Amounts ===', async (ctx: MyContext) => {
        // do sth.
      })
      .row()
      .text((ctx: MyContext) => {
        return ctx.session.selectedBuyAmountOfETH === '0.1'
          ? '0.1ETH ✅'
          : '0.1ETH';
      })
      .text((ctx: MyContext) => {
        return ctx.session.selectedBuyAmountOfETH === '0.3'
          ? '0.3ETH ✅'
          : '0.3ETH';
      })
      .text((ctx: MyContext) => {
        return ctx.session.selectedBuyAmountOfETH === '0.5'
          ? '0.5ETH ✅'
          : '0.5ETH';
      })
      .row()
      .text('=== Select Chain ===', async (ctx: MyContext) => {})
      .row()
      .text(
        (ctx: MyContext) => {
          return ctx.session.selectedChain === 'Celo' ? 'Celo ✅' : 'Celo';
        },
        (ctx: MyContext) => {
          ctx.session.selectedChain = 'Celo';
          ctx.menu.update();
        },
      )
      .text(
        (ctx: MyContext) => {
          return ctx.session.selectedChain === 'Safe' ? 'Safe ✅' : 'Safe';
        },
        (ctx: MyContext) => {
          ctx.session.selectedChain = 'Safe';
          ctx.menu.update();
        },
      )
      .row()
      .text(ENTER_TOKEN_ADDRESS, () => {});

    return buyInterface;
  }

  createSellInterface(ctrl: TgbotController) {
    const buyInterface = new Menu<MyContext>('sell-interface-identifier', {
      autoAnswer: false,
    })
      .back('↩ Menu', async (ctx: MyContext) => {
        // do sth.
      })
      .text('❌ Close', async (ctx: MyContext) => {
        // do sth.
      })
      .row()
      .text('=== Select Wallets ===', async (ctx: MyContext) => {
        // do sth.
      })
      .row()
      .text('W1 ✅', async (ctx: MyContext) => {
        // do sth.
      })
      .text('W2 ✅', async (ctx: MyContext) => {
        // do sth.
      })
      .text('W3 ✅', async (ctx: MyContext) => {
        // do sth.
      })
      .text('=== Select Wallets ===', async (ctx: MyContext) => {
        // do sth.
      })
      .text((ctx: MyContext) => {
        return ctx.session.account === '0.1' ? '0.1ETH ✅' : '0.1ETH';
      })
      .text((ctx: MyContext) => {
        return ctx.session.account === '0.3' ? '0.3ETH ✅' : '0.3ETH';
      })
      .text((ctx: MyContext) => {
        return ctx.session.account === '0.5' ? '0.5ETH ✅' : '0.5ETH';
      })
      .text('📝 Enter Token Address', () => {});

    return buyInterface;
  }
  createMenu(ctrl: TgbotController): Menu<MyContext> {
    const menu = new Menu<MyContext>('start-menu-identifier', {
      autoAnswer: false,
    })
      // .submenu('Sell Tokens', 'sell-interface-identifier')
      .text('Buy Tokens', async (ctx) => {
        ctx.session.last_message_id = ctx.msg?.message_id;
        // ctx.answerCallbackQuery("123");// 弹窗显示123
        ctx.session.route = 'buy';

        ctx.session.last_message_id = ctx.msg.message_id;

        ctx.menu.nav('buy-interface-identifier');

        ctx.reply(ENTER_TOKEN_ADDRESS, {
          reply_markup: {
            force_reply: true,
          },
        });
        // ctx.menu.update();
      })
      .text('Sell Tokens', async (ctx) => {
        ctx.session.last_message_id = ctx.msg?.message_id;
        // ctx.answerCallbackQuery("123");// 弹窗显示123
        ctx.reply(Username_Question, {
          reply_markup: {
            force_reply: true,
          },
        });
      });

    return menu;
  }
}
