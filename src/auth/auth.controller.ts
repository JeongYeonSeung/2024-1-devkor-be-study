import { AuthService } from './auth.service';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAccessAuthGuard } from './guards/jwt-access.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로그인 요청
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const user = req?.user;

    console.log('user : ', user);

    return await this.authService.getToken(user.id);
  }

  // refresh 요청
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const user = req?.user;
    return await this.authService.refreshJWT(user.id, user.refreshToken);
  }

  // 로그아웃 요청 (refresh token 삭제, access token은 FE에서 삭제?)
  @UseGuards(JwtAccessAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const user = req?.user;
    return await this.authService.logout(user.id);
  }
}
