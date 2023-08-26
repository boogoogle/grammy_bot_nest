import { Injectable } from '@nestjs/common';
import {
  HDNodeWallet,
  JsonRpcProvider,
  Signer,
  Contract,
  Wallet,
  ethers,
  randomBytes,
} from 'ethers';
import { IWallet } from 'types';
import { computePoolAddress } from '@uniswap/v3-sdk';
import * as Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import * as IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { ConfigService, ConstantService, UtilService } from 'src/common';

const privateKey =
  '0xc057588115451236e5091795d50bc26e8de44d28da9a4517b0d9ef81a85082e9';
@Injectable()
export class Web3Service {
  private provider: JsonRpcProvider;
  private signer: Signer;

  constructor(
    private config: ConfigService,
    private constant: ConstantService,
    private util: UtilService,
  ) {
    const _addr = this.config.get('WEB_PROVIDER');
    this.provider = new ethers.JsonRpcProvider(_addr);
  }

  async getSigner() {
    if (!this.signer) {
      this.signer = await new ethers.Wallet(privateKey, this.provider);
    }
    return this.signer;
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

  async getCurrentETHInfo() {
    const blockNumber = await this.provider.getBlockNumber();
    // 当前建议的gas设置，返回数据格式为bigint
    const feeData = await this.provider.getFeeData();

    const quote = await this.getQuote();

    return {
      blockNumber,
      gas: ethers.formatUnits(feeData.gasPrice, 'gwei'),
      quote,
    };
  }

  async getQuote() {
    const quoterContract: Contract = new Contract(
      this.constant.QUOTER_CONTRACT_ADDRESS,
      Quoter.abi,
      this.provider,
    );

    const poolConstants = await this.getPoolConstants();

    let quotedAmountOut;
    try {
      quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        this.util
          .fromReadableAmount(
            this.constant.CurrentConfig.tokens.amountIn,
            this.constant.CurrentConfig.tokens.in.decimals,
          )
          .toString(),
        0,
      );
    } catch (error) {
      console.log(error, '--error');
    }

    quotedAmountOut = ethers.formatUnits(
      quotedAmountOut,
      this.constant.CurrentConfig.tokens.out.decimals,
    );

    return ((1 / quotedAmountOut) * 10000).toString().slice(0, 4);
    // return this.util.toReadableAmount(
    //   quotedAmountOut,
    //   this.constant.CurrentConfig.tokens.out.decimals,
    // );
  }

  async getPoolConstants(): Promise<{
    token0: string;
    token1: string;
    fee: number;
  }> {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: this.constant.POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: this.constant.CurrentConfig.tokens.in,
      tokenB: this.constant.CurrentConfig.tokens.out,
      fee: this.constant.CurrentConfig.tokens.poolFee,
    });

    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      this.provider,
    );
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ]);

    return {
      token0,
      token1,
      fee,
    };
  }
}
