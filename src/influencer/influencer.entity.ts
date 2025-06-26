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
  influLicense: string; // 사업자등록증 파일 경로

  @Column()
  influDepartment: string;

  @Column({ type: 'enum', enum: FORM })
  influType: FORM;

  @Column({ type: 'text' })
  influPurpose: string;

  @Column()
  promoUrl: string;
}
