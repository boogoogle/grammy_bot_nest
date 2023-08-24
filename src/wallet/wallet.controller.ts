import { Controller, Get } from '@nestjs/common';

@Controller('wallet')
export class WalletController {
  @Get('my')
  my() {
    return 'hello wallet';
  }
}
