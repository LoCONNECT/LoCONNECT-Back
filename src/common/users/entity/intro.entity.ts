import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './users.entity';

export type IntroType = 'restaurant' | 'media' | 'influ';
export type ApplyStatus = 'pending' | 'accepted' | 'rejected';

@Entity('intro_applies')
export class IntroApply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User; // 신청자

  @Column({ type: 'enum', enum: ['restaurant', 'media', 'influ'] })
  introType: IntroType;

  @Column('int')
  introId: number; // 어떤 intro에 신청했는지

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: ApplyStatus;

  @CreateDateColumn()
  createdAt: Date;
}
