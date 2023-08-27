import { Context } from 'grammy';
import { Router } from '@grammyjs/router';

export interface SessionData {
  username: string;
  address: string;
  isBuying: boolean;
  route: 'menu' | 'buy' | 'sell';
  selectedWallet: 'w1' | 'w2' | 'w3';
  selectedBuyAmountOfETH: '0.1' | '0.3' | '0.5';
  tradingTokenAddress?: '';
  selectedChain: 'Celo' | 'Safe'
  last_message_id?: string | number;
}

export type MyContext = Context &
  Router &
  ConversationFlavor &
  SessionFlavor<SessionData>;
