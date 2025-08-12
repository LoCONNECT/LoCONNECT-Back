import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './inquiry.entity';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthRequest } from '../auth/auth.interface';
import { CreateInquiryDto } from './dto/create.dto';
import { QueryInquiriesDto } from './dto/query.dto';

@Controller('inquiries')
@UseGuards(JwtAuthGuard)
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // 문의 생성
  @Post()
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateInquiryDto,
  ): Promise<{ inquiry: Inquiry }> {
    const inquiry = await this.inquiryService.create(req.user.id, dto);
    return { inquiry };
  }

  // 내 문의 목록
  @Get()
  async findMy(
    @Req() req: AuthRequest,
    @Query() query: QueryInquiriesDto,
  ): Promise<{
    inquiries: Inquiry[];
  }> {
    const { inquiries, total } = await this.inquiryService.findMy(
      req.user.id,
      query,
    );
    return {
      inquiries,
    };
  }

  // 내 단일 문의 상세
  @Get(':id')
  async findMyOne(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ inquiry: Inquiry }> {
    const inquiry = await this.inquiryService.findMyOne(req.user.id, id);
    return { inquiry };
  }

  // 관리자: 상태 변경
  //   @Patch(':id/status')
  //   async updateStatus(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() dto: UpdateInquiryStatusDto,
  //   ): Promise<{ inquiry: Inquiry }> {
  //     const inquiry = await this.inquiryService.updateStatus(id, dto.status);
  //     return { inquiry };
  //   }
}
