import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class MailService {
  private readonly redis: RedisClientType;

  constructor() {
    // 1) Redis 클라이언트 초기화
    this.redis = createClient({
      // url: process.env.REDIS_URL, // 필요하면 환경변수로
    });
    this.redis.connect().catch((err) => console.error('Redis 연결 실패', err));
  }

  //인증 코드 발송
  async sendVerificationEmailCode(email: string): Promise<{ result: boolean }> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 6자리

    const templatePath = path.join(__dirname, 'templates', 'mail.ejs');
    const html = await ejs.renderFile(templatePath, {
      email,
      code: verificationCode,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: (process.env.SMTP_PASS || '').trim(),
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: '[LoCONNECT] 이메일 인증 안내',
      html,
    };

    try {
      await this.redis.setEx(`verify:${email}`, 300, verificationCode);

      await transporter.sendMail(mailOptions);
      return { result: true };
    } catch (error) {
      console.error('메일 발송 실패:', error);
      return { result: false };
    }
  }

  //이메일 인증코드 검증
  async verifyEmailCode(
    email: string,
    inputCode: string,
  ): Promise<{ result: boolean; message: string }> {
    const key = `verify:${email}`;
    const savedCode = await this.redis.get(key);

    if (!savedCode) {
      return {
        result: false,
        message: '인증 코드가 만료되었거나 존재하지 않습니다.',
      };
    }

    if (savedCode !== inputCode) {
      return { result: false, message: '인증 코드가 일치하지 않습니다.' };
    }

    await this.redis.del(key); // 검증 후 코드 삭제
    return { result: true, message: '이메일 인증이 완료되었습니다.' };
  }
}
