import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/entity/users.entity';
import { Proposal } from '../proposal/proposal.entity';
import { Settlement } from '../settlement/settlement.entity';

// 결제
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  method: string;

  @CreateDateColumn()
  paidAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 어떤 제안에 관한 결제
  @ManyToOne(() => Proposal, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'proposal_id' })
  proposal: Proposal;

  // 정산과 연결
  @ManyToOne(() => Settlement, (settlement) => settlement.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'settlement_id' })
  settlement: Settlement;
}
