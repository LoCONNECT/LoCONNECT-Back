import { User } from 'src/common/user/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { StoreIntro } from './store_intro.entity';

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

  @Column({ nullable: true })
  logoImage: string;

  @Column({ type: 'int', default: 0 })
  minPromotionPrice: number;

  @OneToMany(() => StoreIntro, (storeIntro) => storeIntro.storeOwner)
  storeIntros: StoreIntro[];
}
