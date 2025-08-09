import {
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreateIntroDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  introduction?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  images?: string[];
}
