import { Context } from 'grammy';

export interface SessionData {
  username: string;
  address: string;
  isBuying: boolean;
}

export type MyContext = Context &
  ConversationFlavor &
  SessionFlavor<SessionData>;
