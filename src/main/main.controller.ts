import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/guard/auth.guard';
import { MainService } from './main.service';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createStorage } from 'src/common/utils/multer-storage';

import { CreateIntroDto } from './dto/intro.dto';
@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get(':type')
  async getMainData(@Param('type') type: string) {
    return this.mainService.getMainData(type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applied/:type/:id')
  async getApplied(
    @Param('type') type: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    return this.mainService.getAppliedCheck(type, Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':type/apply')
  async applyToIntro(
    @Param('type') type: string,
    @Body('id') introId: number,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    return this.mainService.applyToIntro(type, introId, userId);
  }

  // main/intro 소개글 작성 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post('intro')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
      storage: createStorage('introImages'),
    }),
  )
  async createIntro(
    @Req() req: Request,
    @UploadedFiles() files: any,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateIntroDto,
  ) {
    console.log('=== 소개글 생성 요청 시작 ===');
    console.log('Files:', files);
    console.log('Body DTO:', dto);
    console.log('User:', req.user);
    
    const userId = req.user['id'];
    const intro = await this.mainService.createMyIntro(userId, dto, files);

    return {
      id: intro.id,
      type:
        'storeOwner' in intro
          ? 'restaurant'
          : 'mediaStaff' in intro
            ? 'media'
            : 'influencer' in intro
              ? 'influ'
              : 'unknown',
      introduction: intro.introduction ?? '',
      images: intro.images ?? [],
      createdAt: intro.createdAt,
      updatedAt: intro.updatedAt,
    };
  }
}
