import { Injectable } from '@nestjs/common';
import { Bot, session, SessionFlavor, Context } from 'grammy';
import { SocksProxyAgent } from 'socks-proxy-agent';

import { Menu, MenuRange, MenuFlavor } from '@grammyjs/menu';
// import { checkUsername, checkAddress } from './utils';

import {
  Address_Question,
  BOT_ADDRESS,
  ENV_MODE_MAP,
  Username_Question,
} from './constants';
import { MyContext, SessionData } from './types';
import { checkUsername, checkAddress } from './utils';

const env = 'DEVELOPMENT'; // @todo 需要改为从环境变量读取

const socksAgent = new SocksProxyAgent('socks://127.0.0.1:51837');

@Injectable()
export class TgbotService {
  private bot: Bot;
  private msgId: string | number;
  private menu: Menu;

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
    this.menu = this.createMenu();

    // Install the session plugin.
    function initial(): SessionData {
      return {
        username: '',
        address: '',
        isBuying: false,
      };
    }
    bot.use(
      session({
        initial,
      }),
    );
    bot.use(this.menu);
  }

  createMenu = function (): Menu<MyContext> {
    const menu = new Menu<MyContext>('start-menu-identifier', {
      autoAnswer: false,
    })
      .text('Add', async (ctx) => {
        this.msgId = ctx.msg?.message_id;
        // ctx.answerCallbackQuery("123");// 弹窗显示123
        ctx.reply(Username_Question, {
          reply_markup: {
            force_reply: true,
          },
        });
      })
      .text(
        (ctx) => {
          return 'Switch to ' + `【${ctx.session.isBuying ? 'Sale' : 'Buy'}】`;
        },
        async (ctx) => {
          ctx.session.isBuying = !ctx.session.isBuying;
          ctx.menu.update(); // update the menu!
        },
      )
      .row()
      .text((ctx) => (ctx.session.isBuying ? 'Buy 0.01' : 'Sale 0.01'))
      .text((ctx) => (ctx.session.isBuying ? 'Buy 0.05' : 'Sale 0.05'));

    menu.dynamic((ctx, range) => {
      range
        .row()
        .text((ctx) => ctx.session.username)
        .text((ctx) => ctx.session.address);
    });

    return menu;
  };

  listen2Message() {
    console.log('l2m');
    this.bot.on('message:text', (ctx: MyContext) => {
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
          ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.msg.reply_to_message.message_id,
          );
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

          ctx.api.editMessageText(
            ctx.chat.id,
            this.msgId as number,
            'Congs!!!',
            {
              reply_markup: this.menu,
            },
          );
          ctx.reply(`✔${ctx.session.username}: 🏠${ctx.session.address}`);

          return;
        } else {
          ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.msg.reply_to_message.message_id,
          );
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

      //   ctx.reply(ctx.msg.text);
    });
  }

  listen2CMD() {
    this.bot.command('start', (ctx) => {
      ctx.reply('here you are', {
        reply_markup: this.menu,
      });
    });

    this.bot.command('test', (ctx) => {
      ctx.reply('alive ');
    });
  }

  start() {
    this.initBot();
    this.listen2CMD();
    this.listen2Message();
    this.bot.start();

    console.log(
      'bot start with DEBUG',
      process.env.DEBUG,
      'ENV_MODE',
      process.env.MODE,
    );
  }
}
