import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { InquiryType } from '../inquiry.entity';

export class CreateInquiryDto {
  @IsEnum(InquiryType)
  type: InquiryType;

  @IsString()
  @IsNotEmpty()
  content: string;
}
