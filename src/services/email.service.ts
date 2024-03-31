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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationToEmail(
    email: string,
    verifyToken: string,
  ): Promise<void> {
    const emailOptions: EmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '인증 메일',
      html: `<h1> 인증 코드를 입력하면 인증이 완료됩니다.</h1><br/>${verifyToken}`,
    };

    return await this.transporter.sendMail(emailOptions);
  }
}
