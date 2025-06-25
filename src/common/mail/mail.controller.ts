import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-code')
  @ApiOperation({ summary: '이메일 인증 코드 발송' })
  @ApiOkResponse({
    description: '메일 발송 성공 여부',
    schema: {
      example: {
        result: true,
      },
    },
  })
  async sendMail(@Body() body: { email: string }) {
    const { email } = body;
    return await this.mailService.sendVerificationEmailCode(email);
  }

  @Post('check-code')
  @ApiOperation({ summary: '이메일 인증 코드 확인' })
  @ApiOkResponse({
    description: '이메일 인증 성공 여부 및 메시지',
    schema: {
      example: {
        result: true,
        message: '이메일 인증이 완료되었습니다.',
      },
    },
  })
  async verifyCode(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    return this.mailService.verifyEmailCode(email, code);
  }
}
