import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('일치하는 이메일이 없습니다.');
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    return {
      id: user.userId,
    };
  }

  async getToken(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) throw new UnauthorizedException('존재하지 않는 유저입니다.');

    const payload = {
      id,
      email: user.email,
      signedAt: Date.now().toString(),
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    // refreshToken을 user table에 저장
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async refreshJWT(id: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) throw new UnauthorizedException('존재하지 않는 유저입니다.');

    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const payload = {
      id,
      email: user.email,
      signedAt: Date.now().toString(),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: process.env.JWT_SECRET,
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    user.refreshToken = newRefreshToken;
    await this.userRepository.save(user);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');

    // refreshToken 삭제
    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
