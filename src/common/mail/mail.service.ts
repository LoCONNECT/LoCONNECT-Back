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
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1', // ← 꼭 지정
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });
    this.redis.connect().catch((err) => console.error('Redis 연결 실패', err));
  }

  //인증 코드 발송
  async sendVerificationEmailCode(email: string): Promise<{ result: boolean }> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 6자리

    const templatePath = path.join(
      __dirname.replace('dist', 'src'),
      'templates',
      'mail.ejs',
    );
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

  // 임시 비밀번호 이메일 발송
  async sendTemporaryPasswordEmail(
    email: string,
    tempPassword: string,
  ): Promise<{ result: boolean }> {
    const templatePath = path.join(
      __dirname.replace('dist', 'src'),
      'templates',
      'password.ejs',
    );

    const html = await ejs.renderFile(templatePath, {
      email,
      password: tempPassword,
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
      subject: '[LoCONNECT] 임시 비밀번호 안내',
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { result: true };
    } catch (error) {
      console.error('임시 비밀번호 메일 발송 실패:', error);
      return { result: false };
    }
  }

  // 관리자 회원가입 거절 사유 이메일 전송
  async sendRejectReasonEmail(
    email: string,
    reason: string,
  ): Promise<{ result: boolean }> {
    const templatePath = path.join(
      __dirname.replace('dist', 'src'),
      'templates',
      'reject.ejs',
    );

    const html = await ejs.renderFile(templatePath, {
      email,
      reason,
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
      subject: '[LoCONNECT] 회원가입 거절 안내',
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { result: true };
    } catch (error) {
      console.error('거절 메일 발송 실패:', error);
      return { result: false };
    }
  }
}
