import { Body, Controller, Post, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.userService.register(dto);
  }

  @Get('test')
  test() {
    return this.userService.test();
  }
}
