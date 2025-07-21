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
import { UserAccept } from 'src/common/users/users.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { NoticeService } from 'src/common/notice/notice.service';
import { CreateNoticeDto } from 'src/common/notice/dto/create.dto';
import { Notice } from 'src/common/notice/notice.entity';
import { UpdateNoticeDto } from 'src/common/notice/dto/update.dto';
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly noticesService: NoticeService,
  ) {}

  // 모든 유저 조회
  @Get('users')
  @ApiOperation({ summary: '유저 목록 조회 (status로 필터링 가능)' })
  async getUsers(@Query('status') status?: string) {
    try {
      const users = await this.adminService.getAllUsers();

      // status가 있으면 필터링해서 반환
      if (status) {
        const filtered = users.filter((x) => x.acceptStatus === status);
        return { users: filtered };
      }

      // status 없으면 전체 반환
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
  ) {
    if (status !== UserAccept.ACCEPT && status !== UserAccept.REJECT) {
      throw new Error(
        '유효하지 않은 상태 값입니다. accept 또는 reject만 가능합니다.',
      );
    }

    const updatedUser = await this.adminService.updateUserAcceptStatus(
      userId,
      status as UserAccept.ACCEPT | UserAccept.REJECT,
    );

    return {
      message: `유저 acceptStatus가 ${status}로 변경되었습니다.`,
      user: updatedUser,
    };
  }

  @Post('/notices')
  async create(@Body() dto: CreateNoticeDto): Promise<Notice> {
    return this.noticesService.create(dto);
  }

  @Patch('/notices/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoticeDto,
  ): Promise<Notice> {
    return this.noticesService.update(id, dto);
  }
}
