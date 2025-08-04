import { ApiProperty } from '@nestjs/swagger';
import { UserAccept, UserRole } from '../entity/users.entity';

export class UserProfileResponseDto {
  @ApiProperty({ example: 1, description: '유저 고유 ID' })
  id: number;

  @ApiProperty({
    example: UserRole.BIZ,
    description: '유저 역할 (biz, media, influ, admin)',
  })
  role: UserRole;

  @ApiProperty({ example: '홍길동', description: '유저 이름' })
  name: string;

  @ApiProperty({ example: 'gildong123', description: '로그인 아이디' })
  loginId: string;

  @ApiProperty({ example: 'gildong@example.com', description: '이메일 주소' })
  email: string;

  @ApiProperty({ example: '010-1234-5678', description: '전화번호' })
  phone: string;

  @ApiProperty({ example: true, description: '필수 약관 동의 여부' })
  agreeRequired: boolean;

  @ApiProperty({ example: false, description: '선택 약관 동의 여부' })
  agreeOptional: boolean;

  @ApiProperty({
    example: UserAccept.ACCEPT,
    description: '회원 승인 상태 (accept, reject, pending)',
  })
  acceptStatus: UserAccept;

  @ApiProperty({
    example: 'some-refresh-token-string',
    description: '리프레시 토큰 (nullable)',
  })
  refresh_token: string | null;

  @ApiProperty({
    example: '2025-06-30T12:00:00.000Z',
    description: '계정 생성 일시',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-06-30T13:00:00.000Z',
    description: '계정 마지막 수정 일시',
  })
  updatedAt: Date;

  @ApiProperty({
    example: {
      id: 1,
      bizName: '로커넥트 치킨',
      bizLicense: 'license/path.jpg',
      bizCategory: '음식점',
      bizPostcode: '12345',
      bizAddress: '서울특별시 강남구 테헤란로',
      bizAddressDetail: '101호',
      bizPhone: '010-5678-1234',
    },
    description:
      '유저 역할에 따라 달라지는 추가 정보 (storeOwner, mediaStaff, influencer)',
  })
  extraInfo: any;
}
