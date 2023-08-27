export type IWallet = {
  address: string;
  privateKey: string;
  mnemonic: string;
  tgAccountId?: number;
};

export type IETH_Info = {
  gas: number;
  quote: string;
  blockNumber: number;
};
