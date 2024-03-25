import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'naver',
      auth: {
        user: 'lilk000011@naver.com',
        pass: 'asas0011!',
      },
    });
  }

  async sendVerificationToEmail(
    email: string,
    verifyToken: string,
  ): Promise<void> {
    const emailOptions: EmailOptions = {
      from: 'lilk000011@naver.com',
      to: email,
      subject: '가입 인증 메일',
      html: `<h1> 인증 코드를 입력하면 가입 인증이 완료됩니다.</h1><br/>${verifyToken}`,
    };

    return await this.transporter.sendMail(emailOptions);
  }
}
