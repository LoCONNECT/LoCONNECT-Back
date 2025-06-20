import { User } from 'src/common/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum FORM {
  PERSONAL = 'personal',
  GROUP = 'group',
}

@Entity('influencers')
export class Influencer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  representativeName: string;

  @Column()
  businessRegFile: string;
  // 사업자 등록증

  @Column({ type: 'enum', enum: FORM })
  form: FORM;

  @Column({ type: 'text' })
  purpose: string;

  @Column()
  promotionUrl: string;
  // 본인 홍보 주소
}
