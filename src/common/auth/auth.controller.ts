import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createStorage } from '../utils/multer-storage';
import { UserRole } from '../users/users.entity';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

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

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // JWT에서 유저 ID 추출 (선택)
    const refreshToken = req.cookies['refresh_token'];
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          this.authService['configService'].get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        ) as { aud?: string };

        if (decoded?.aud) {
          const userId = Number(decoded.aud);
          await this.authService.logout(userId);
        }
      } catch (e) {
        // 토큰이 유효하지 않을 수 있음 - 무시
      }
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      message: '로그아웃 되었습니다.',
    };
  }
}
