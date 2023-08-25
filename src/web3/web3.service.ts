import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HDNodeWallet, Wallet, ethers, randomBytes } from 'ethers';
import { IWallet } from 'types';

@Injectable()
export class Web3Service {
  constructor(private config: ConfigService) {
    // const _addr = this.config.get('WEB_PROVIDER');
    // this.provider = new ethers.JsonRpcProvider(_addr);
  }

  createWallet(): Array<IWallet> {
    // 生成随机助记词
    const mnemonic = ethers.Mnemonic.entropyToPhrase(randomBytes(32));
    const hdNode: HDNodeWallet = HDNodeWallet.fromPhrase(mnemonic);

    // generate 3 address
    const walletNum = 3;
    // 派生路径：m / purpose' / coin_type' / account' / change / address_index
    // 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
    const basePath = "m/44'/60'/0'/0";
    const wallets: Array<IWallet> = [];
    for (let i = 0; i < walletNum; i++) {
      const hdNodeNew = hdNode.derivePath(basePath + '/' + i);
      const walletNew: Wallet = new ethers.Wallet(hdNodeNew.privateKey);

      wallets.push({
        address: walletNew.address,
        privateKey: hdNodeNew.privateKey,
        mnemonic,
      });
    }
    return wallets;
  }
}
