import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { UserService } from 'src/user/user.service';
import { MyContext } from './types';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class TgbotService {
  private bot: Bot;
  private msgId: string | number;
  private menu: Menu;

  constructor(private user: UserService, private web3: Web3Service) {}

  processMenuCMD(ctx: MyContext, menu: Menu) {
    const currentETHInfo = this.web3.getCurrentETHInfo();
    ctx.reply('here you are', {
      reply_markup: menu,
    });
  }
}
