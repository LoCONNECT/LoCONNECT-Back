import {
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIntroDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  introduction?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  images?: string[];

  // AI 생성 관련 필드
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  useAI?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['friendly', 'professional', 'humorous'])
  tone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  keywords?: string;

  // 가게 사장용 추가 필드
  @IsOptional()
  @IsString()
  @MaxLength(200)
  representativeMenus?: string;

  @IsOptional()
  @IsString()
  @IsIn(['cozy', 'modern', 'traditional', 'casual', 'luxury'])
  atmosphere?: string;

  @IsOptional()
  @IsString()
  @IsIn(['family', 'date', 'solo', 'group', 'business'])
  concept?: string;

  // 방송국용 추가 필드
  @IsOptional()
  @IsString()
  @IsIn(['teens', 'twenties-thirties', 'forties-fifties', 'all'])
  targetAudience?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  broadcastFeatures?: string;

  // 인플루언서용 추가 필드
  @IsOptional()
  @IsString()
  @IsIn(['under-10k', '10k-50k', '50k-100k', 'over-100k'])
  subscriberCount?: string;

  @IsOptional()
  @IsString()
  @IsIn(['review', 'mukbang', 'daily', 'information', 'entertainment'])
  contentType?: string;
}
