import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { EmailService } from 'src/services/email.service';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { EmailTokenEntity } from 'src/entities/email-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmailTokenEntity)
    private readonly emailTokenRepository: Repository<EmailTokenEntity>,
    private readonly emailService: EmailService,
  ) {}

  // email 중복 검사
  async checkForDuplicateEmail(email: string) {
    const isEmailValid = await this.isEmailValid(email);

    if (!isEmailValid) {
      throw new BadRequestException('올바른 이메일 형식이 아닙니다.');
    }
    const exitedUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (exitedUser) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    return true;
  }

  // 입력한 email로 인증 코드 발송하고, DB에 인증 코드 저장
  async sendVerification(email: string) {
    const verifyToken = await this.generateRandomToken();

    const existedEmailToken = await this.emailTokenRepository.findOne({
      where: { email },
    });

    if (existedEmailToken) {
      existedEmailToken.token = verifyToken;
      existedEmailToken.isVerified = false;
      await this.emailTokenRepository.save(existedEmailToken);
    } else {
      const emailToken = new EmailTokenEntity();
      emailToken.email = email;
      emailToken.token = verifyToken;
      emailToken.isVerified = false;
      await this.emailTokenRepository.save(emailToken);
    }

    await this.emailService.sendVerificationToEmail(email, verifyToken);
  }

  // DB내의 인증 코드와 비교하여 검증
  async verifyToken(email: string, userInputToken: string): Promise<boolean> {
    const emailToken = await this.emailTokenRepository.findOne({
      where: { email, token: userInputToken },
    });

    if (!emailToken) {
      throw new BadRequestException('인증 코드가 일치하지 않습니다.');
    } else {
      emailToken.isVerified = true;
      await this.emailTokenRepository.save(emailToken);
    }

    return true;
  }

  // 회원 가입 로직
  async createUser(email: string, nickname: string, password: string) {
    const isEmailVerified = await this.emailTokenRepository.findOne({
      where: { email },
    });

    const isPasswordValid = await this.isPasswordValid(password);

    if (!isEmailVerified || !isEmailVerified.isVerified) {
      throw new BadRequestException('이메일 인증이 필요합니다.');
    }

    if (password.length < 8) {
      throw new BadRequestException('비밀번호는 8자 이상이어야 합니다.');
    }

    if (!isPasswordValid) {
      throw new BadRequestException('비밀번호는 특수문자를 포함해야 합니다.');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.save({
      email: email,
      nickname: nickname,
      password: hashedPassword,
    });

    return user;
  }

  // 6자리 랜덤한 토큰 생성
  private async generateRandomToken(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
  // 이메일 형식 검증
  private async isEmailValid(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@naver\.com$/;
    return emailRegex.test(email);
  }
  // 비밀번호 형식 검증
  private async isPasswordValid(password: string): Promise<boolean> {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharacters.test(password);
  }
}
