// 정산
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';
@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  settlementDate: Date;

  @Column({ type: 'int' })
  totalAmount: number;

  @OneToMany(() => Payment, (payment) => payment.settlement)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;
}
