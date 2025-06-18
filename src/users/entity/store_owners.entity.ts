import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '././users.entity';

@Entity('storeOwners')
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

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  introduction: string;

  @Column({ nullable: true })
  logoImage: string;

  @Column({ type: 'int', default: 0 })
  minPromotionPrice: number;
}
