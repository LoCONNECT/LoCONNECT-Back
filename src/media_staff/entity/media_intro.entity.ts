import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaStaff } from './media_staff.entity';

@Entity('media_intros')
export class MediaIntro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MediaStaff, (staff) => staff.intros, {
    onDelete: 'CASCADE',
  })
  mediaStaff: MediaStaff;

  @Column({ type: 'text', nullable: true })
  introduction: string;

  @Column('simple-array', { nullable: true })
  images: string[]; // 이미지 URL 최대 3장

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
