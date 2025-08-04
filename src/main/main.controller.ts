import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/guard/auth.guard';
import { MainService } from './main.service';
import { Request } from 'express';

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
}
