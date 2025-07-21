import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create.dto';
import { UpdateNoticeDto } from './dto/update.dto';
import { Notice } from './notice.entity';

@Controller('notice')
export class NoticesController {
  constructor(private readonly noticesService: NoticeService) {}

  @Get('/allnotices')
  async findAll(): Promise<Notice[]> {
    return this.noticesService.findAll();
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
