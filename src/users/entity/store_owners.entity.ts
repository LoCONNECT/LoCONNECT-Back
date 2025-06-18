import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '././users.entity';

@Entity()
export class StoreOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  storeName: string;

  @Column()
  file: string;

  @Column()
  businessType: string;

  @Column()
  storeAddress: string;

  @Column()
  storePhone: string;
}
