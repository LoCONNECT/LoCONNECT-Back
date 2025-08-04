import { User } from 'src/common/users/entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { InfluencerIntro } from './influencer.intro.entity';

export enum FORM {
  PERSONAL = 'personal',
  GROUP = 'group',
}

@Entity('influencers')
export class Influencer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  representativeName: string;

  @Column()
  influLicense: string;

  @Column()
  influDepartment: string;

  @Column({ type: 'enum', enum: FORM })
  influType: FORM;

  @Column({ type: 'text' })
  influPurpose: string;

  @Column()
  promoUrl: string;

  @OneToMany(() => InfluencerIntro, (intro) => intro.influencer)
  intros: InfluencerIntro[];
}
