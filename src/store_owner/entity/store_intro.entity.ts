import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreOwner } from './store_owners.entity';

@Entity('store_intros')
export class StoreIntro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreOwner, (storeOwner) => storeOwner.storeIntros, {
    onDelete: 'CASCADE',
  })
  storeOwner: StoreOwner;

  @Column({ type: 'text', nullable: true })
  introduction: string;
  // 업체 소개글

  @Column('simple-array', { nullable: true })
  images: string[];
  // 대표 이미지 URL 3장까지 저장 (배열로 관리)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
