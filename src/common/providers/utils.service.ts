import { Injectable } from '@nestjs/common';
import { BigNumberish, ethers } from 'ethers';

const READABLE_FORM_LEN = 4;

@Injectable()
export class UtilService {
  public fromReadableAmount(amount: number, decimals: number): BigNumberish {
    return ethers.parseUnits(amount.toString(), decimals);
  }

  public toReadableAmount(rawAmount: number, decimals: number): string {
    return ethers.formatUnits(rawAmount, decimals).slice(0, READABLE_FORM_LEN);
  }
}
