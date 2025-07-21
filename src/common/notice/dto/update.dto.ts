import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeDto } from './create.dto';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
