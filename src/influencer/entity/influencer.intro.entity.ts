import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Influencer } from './influencer.entity';

@Entity('influencer_intros')
export class InfluencerIntro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Influencer, (influencer) => influencer.intros, {
    onDelete: 'CASCADE',
  })
  influencer: Influencer;

  @Column({ type: 'text', nullable: true })
  introduction: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
