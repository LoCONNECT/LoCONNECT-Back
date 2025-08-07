import { User } from 'src/common/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProposalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum UserType {
  STOREOWNER = 'storeOwner',
  INFLUENCER = 'influencer',
  MEDIASTAFF = 'mediaStaff',
}
// 제안
@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  proposer: User;
  // 제안한 사람

  @ManyToOne(() => User)
  receiver: User;
  // 제안 받은 사람

  @Column()
  proposedPrice: number;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;
  // 매칭 상태

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
