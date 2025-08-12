import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry, InquiryStatus } from './inquiry.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateInquiryDto } from './dto/create.dto';
import { QueryInquiriesDto } from './dto/query.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
  ) {}

  // 문의 생성
  async create(userId: number, dto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiryRepo.create({
      user: { id: userId } as any,
      type: dto.type,
      content: dto.content,
    });
    return this.inquiryRepo.save(inquiry);
  }

  // 내 문의
  async findMy(
    userId: number,
    query: QueryInquiriesDto,
  ): Promise<{ inquiries: Inquiry[]; total: number }> {
    const { page = 1, limit = 10, type, status } = query;

    const where: FindOptionsWhere<Inquiry> = { user: { id: userId } as any };
    if (type) where.type = type;
    if (status) where.status = status;

    const [inquiries, total] = await this.inquiryRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return { inquiries, total };
  }

  // 내 문의 하나씩
  async findMyOne(userId: number, inquiryId: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo.findOne({
      where: { id: inquiryId, user: { id: userId } as any },
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  // 관리자: 상태 변경
  async updateStatus(
    inquiryId: number,
    status: InquiryStatus,
  ): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo.findOne({
      where: { id: inquiryId },
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');

    inquiry.status = status;
    return this.inquiryRepo.save(inquiry);
  }
}
