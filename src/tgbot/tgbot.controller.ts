import { Controller } from '@nestjs/common';
import { Bot, session } from 'grammy';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Router } from '@grammyjs/router';

import { Menu } from '@grammyjs/menu';

import { BOT_ADDRESS, ENV_MODE_MAP } from './constants';

import { MyContext, SessionData } from './types';
import { TgbotService } from './tgbot.service';
import { Web3Service } from 'src/web3/web3.service';

const env = 'DEVELOPMENT'; // 'PROD' @todo 需要改为从环境变量读取

const socksAgent = new SocksProxyAgent('socks://127.0.0.1:51837');

// Install the session plugin.
function initial(): SessionData {
  return {
    username: '',
    address: '',
    isBuying: false,
    route: 'menu',
    selectedWallet: 'w1',
    selectedChain: 'Celo',
    selectedBuyAmountOfETH: '0.1',
  };
}

@Controller('tgbot')
export class TgbotController {
  private bot: Bot;
  private msgId: string | number;
  private menu: Menu;

  constructor(private tgService: TgbotService, private web3: Web3Service) {}

  initBot() {
    this.bot = new Bot<MyContext>(BOT_ADDRESS, {
      client: {
        baseFetchConfig:
          env === ENV_MODE_MAP.DEVELOPMENT
            ? {
                agent: socksAgent,
                compress: true,
              }
            : null,
      },
    });

    const { bot } = this;
    this.menu = this.tgService.createMenu(this);
    const buyInterface = this.tgService.createBuyInterface(this);
    const sellInterface = this.tgService.createSellInterface(this);

    bot.use(
      session({
        initial,
      }),
    );
    this.menu.register(buyInterface);
    this.menu.register(sellInterface);
    bot.use(this.menu);
  }

  configureRouter() {
    const router = new Router((ctx: MyContext) => {
      return ctx.session.route;
    });

    router.route('menu').on('message:text', async (ctx) => {
      /* ... */
      ctx.reply('router key' + ctx.msg.text);
    });

    router.otherwise().on(':text', (ctx) => {
      ctx.reply('otherwise');
      /* ... */
    }); // called if no route matches
    this.bot.use(router);
  }

  listen2Message() {
    this.bot.on('message:text', this.tgService.processMessageText);
  }

  listen2CMD() {
    this.bot.command('menu', (ctx) =>
      this.tgService.processMenuCMD(ctx, this.menu),
    );

    this.bot.command('test', (ctx) => {
      ctx.reply('alive ');
    });
  }

  start() {
    this.initBot();
    this.listen2CMD();
    // this.listen2Message();
    this.configureRouter();

    this.bot.catch((error) => {
      console.log(error, '==> bot error');
    });
    this.bot.start();

    console.log(
      'bot start with DEBUG',
      process.env.DEBUG,
      'ENV_MODE',
      process.env.MODE,
    );
  }
}
