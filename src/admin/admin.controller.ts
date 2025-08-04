import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { UserAccept } from 'src/common/users/entity/users.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { NoticeService } from 'src/common/notice/notice.service';
import { CreateNoticeDto } from 'src/common/notice/dto/create.dto';
import { Notice } from 'src/common/notice/notice.entity';
import { UpdateNoticeDto } from 'src/common/notice/dto/update.dto';
import { JwtAuthGuard } from 'src/common/auth/guard/auth.guard';
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly noticesService: NoticeService,
  ) {}

  // 모든 유저 조회
  @Get('users')
  @ApiOperation({ summary: '유저 목록 조회 (status + 검색조건)' })
  async getUsers(
    @Query('status') status?: string,
    @Query('searchType') searchType?: string,
    @Query('searchWord') searchWord?: string,
  ) {
    try {
      const users = await this.adminService.getUsers(
        status,
        searchType,
        searchWord,
      );
      return { users };
    } catch (err) {
      console.error('유저 조회 에러:', err.message);
      throw new InternalServerErrorException('유저 조회 실패');
    }
  }

  // 유저 권한 승인
  @Patch('users/:id/accept')
  async updateUserAcceptStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ) {
    if (status !== UserAccept.ACCEPT && status !== UserAccept.REJECT) {
      throw new BadRequestException(
        'status는 accept 또는 reject만 가능합니다.',
      );
    }

    const updatedUser = await this.adminService.updateUserStatus(
      userId,
      status as UserAccept.ACCEPT | UserAccept.REJECT,
      reason,
    );

    return {
      message: `유저가 ${status}로 처리되었습니다.`,
      user: updatedUser,
    };
  }

  // 공지사항 만들기
  @Post('/notices')
  async create(@Body() dto: CreateNoticeDto): Promise<Notice> {
    return this.noticesService.create(dto);
  }

  // 공지사항 수정
  @Patch('/notices/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoticeDto,
  ): Promise<Notice> {
    return this.noticesService.update(id, dto);
  }
}
