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
import { createStorage } from '../utils/multer-storage';
import { UserRole } from '../users/users.entity';

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
      throw new BadRequestException('아이디를 입력해주세요.');
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

  // 소상공인 회원가입
  @Post('signup/biz')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'bizLicense', maxCount: 1 }], {
      storage: createStorage('bizLicenses'),
    }),
  )
  async signupBiz(@UploadedFiles() files: any, @Body() body: any) {
    return this.authService.signUp('biz', body, files);
  }

  // 방송국 회원가입
  @Post('signup/media')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'proofFile', maxCount: 1 }], {
      storage: createStorage('mediaProofs'),
    }),
  )
  async signupMedia(@UploadedFiles() files: any, @Body() body: any) {
    return this.authService.signUp('media', body, files);
  }

  // 인플루언서 회원가입
  @Post('signup/influ')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'influLicense', maxCount: 1 }], {
      storage: createStorage('influLicenses'),
    }),
  )
  async signupInflu(@UploadedFiles() files: any, @Body() body: any) {
    return this.authService.signUp('influ', body, files);
  }

  // 로그인
  @Post('login')
  async login(
    @Body() body: { id: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, password } = body;

    const result = await this.authService.localLogin(id, password);

    if (!result.user) {
      return {
        message: result.message || '로그인에 실패했습니다.',
      };
    }

    const { access_token, refresh_token } = await this.authService.issueTokens(
      result.user,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });

    return {
      ...result.user,
      extraInfo: result.user.extraInfo,
    };
  }

  // 관리자 로그인
  @Post('adminLogin')
  async adminLogin(
    @Body() body: { id: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, password } = body;

    const result = await this.authService.localLogin(id, password);

    if (!result.user) {
      return {
        message: result.message || '로그인에 실패했습니다.',
      };
    }

    if (result.user.role !== UserRole.ADMIN) {
      return {
        message: '관리자 권한이 없습니다.',
      };
    }

    const { access_token, refresh_token } = await this.authService.issueTokens(
      result.user,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });

    return {
      id: result.user.id,
      name: result.user.name,
      role: result.user.role,
    };
  }
}
