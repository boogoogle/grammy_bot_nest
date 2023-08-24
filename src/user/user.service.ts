import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}
  async register(dto: RegisterUserDto) {
    return this.config.get('DATABASE_URL');
  }
}
