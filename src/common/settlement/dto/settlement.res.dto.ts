import { ApiProperty } from '@nestjs/swagger';

export class SettleDetailDto {
  @ApiProperty({ example: 1, description: '결제 ID' })
  id: number;

  @ApiProperty({ example: '홍길동 협업 제안', description: '정산 항목 제목' })
  name: string;

  @ApiProperty({ example: 300000, description: '결제 금액' })
  price: number;

  @ApiProperty({ example: '영상 업로드 및 홍보', description: '내용 설명' })
  desc: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    nullable: true,
    description: '썸네일 이미지',
  })
  thumbnail: string | null;

  @ApiProperty({ example: 'approved', description: '정산 상태 (제안 상태)' })
  settleStatus: string;
}

export class SettlementHistoryDto {
  @ApiProperty({ example: '25.08.03', description: '정산일자 (YY.MM.DD 형식)' })
  date: string;

  @ApiProperty({ example: 500000, description: '해당 날짜의 총 정산 금액' })
  totalAmount: number;

  @ApiProperty({
    type: [SettleDetailDto],
    description: '해당 날짜의 정산 상세 목록',
  })
  settles: SettleDetailDto[];
}
