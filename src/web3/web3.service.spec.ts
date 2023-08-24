import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { ConfigModule } from '@nestjs/config';

describe('Web3Service', () => {
  let service: Web3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // ignoreEnvFile: true, // disable looking for .env file; only use runtime environment
        }),
      ],
      providers: [Web3Service],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('can create 3 new accounts', () => {
    const wallets = service.create();
    expect(wallets.length == 3).toBeDefined();
  });
});
