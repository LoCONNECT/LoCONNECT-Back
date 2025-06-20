import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/users.entity';

export enum TargetType {
  STORE = 'store',
  PROGRAM = 'program',
  INFLUENCER = 'influencer',
}

@Entity('keeps')
export class Keep {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'enum', enum: TargetType })
  targetType: TargetType;

  @Column()
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}
