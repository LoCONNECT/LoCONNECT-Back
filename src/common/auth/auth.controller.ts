import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 중복 확인
  @Get('check/:type')
  async checkDuplicate(
    @Param('type') type: 'id' | 'phone',
    @Query('id') id?: string,
    @Query('phone') phone?: string,
  ) {
    if (type === 'id' && !id) {
      throw new BadRequestException('이메일을 입력해주세요.');
    }
    if (type === 'phone' && !phone) {
      throw new BadRequestException('전화번호를 입력해주세요.');
    }

    const isDuplicate = await this.authService.checkDuplicate(type, {
      id,
      phone,
    });
    return { isDuplicate };
  }

  // 타입별로 회원가입
  @Post(':type')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bizLicense', maxCount: 1 },
      { name: 'proofFile', maxCount: 1 },
      { name: 'influLicense', maxCount: 1 },
    ]),
  )
  async signUp(
    @Param('type') type: 'biz' | 'media' | 'influ',
    @UploadedFiles() files: any,
    @Body() body: any,
  ) {
    return this.authService.signUp(type, body, files);
  }

  @Post('login')
  async login(
    @Body() body: { id: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, password } = body;

    const result = await this.authService.localLogin(id, password);

    if (!result.success) {
      return result;
    }

    const { access_token, refresh_token } = await this.authService.issueTokens(
      result.user!,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 15, // 15분
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
    });

    return {
      success: true,
      id: result.user!.id,
      name: result.user!.name,
      phone: result.user!.phone,
      role: result.user!.role,
    };
  }
}
