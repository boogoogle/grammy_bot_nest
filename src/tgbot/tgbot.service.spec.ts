import { Test, TestingModule } from '@nestjs/testing';
import { TgbotService } from './tgbot.service';

describe('TgbotService', () => {
  let service: TgbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgbotService],
    }).compile();

    service = module.get<TgbotService>(TgbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
