import { User } from 'src/common/users/entity/users.entity';
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

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  price: number;

  @Column()
  bizName: string;

  @Column()
  bizLicense: string; // 사업자등록증 파일 경로

  @Column()
  bizCategory: string;

  @Column()
  bizPostcode: string;

  @Column()
  bizAddress: string;

  @Column()
  bizAddressDetail: string;

  @Column()
  bizPhone: string;

  @OneToMany(() => StoreIntro, (storeIntro) => storeIntro.storeOwner)
  storeIntros: StoreIntro[];
}
