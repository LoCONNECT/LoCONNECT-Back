import { IsNotEmpty } from 'class-validator';

export class CreateNoticeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
