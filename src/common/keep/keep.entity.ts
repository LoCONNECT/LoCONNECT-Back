import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/entity/users.entity';

@Entity('keeps')
export class Keep {
  @PrimaryGeneratedColumn()
  id: number;

  // 찜한 사람 (로그인한 유저)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 찜 당한 사람
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  target: User;

  @Column()
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}
