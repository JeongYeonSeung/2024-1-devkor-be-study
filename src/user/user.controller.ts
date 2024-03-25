import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('check-email-duplication')
  async checkEmailDuplication(@Body() body): Promise<boolean> {
    const email = body.email;
    const check = await this.userService.checkForDuplicateEmail(email);
    if (check) {
      console.log('중복 검사 완료!');
      return true;
    }
  }

  @Post('send-verify-email')
  async sendVerifyEmail(@Body() body): Promise<void> {
    const email = body.email;
    await this.userService.sendVerification(email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<boolean> {
    const email = dto.email;
    const token = dto.token;
    const check = await this.userService.verifyToken(email, token);
    if (check) {
      console.log('이메일 인증 완료!');
      return true;
    }
  }

  @Post('register')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { email, nickname, password } = dto;
    await this.userService.createUser(email, nickname, password);
  }
}
