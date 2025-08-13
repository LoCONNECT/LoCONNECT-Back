import { IsEnum } from 'class-validator';
import { InquiryStatus } from '../inquiry.entity';

export class UpdateInquiryStatusDto {
  @IsEnum(InquiryStatus)
  status: InquiryStatus;
}
