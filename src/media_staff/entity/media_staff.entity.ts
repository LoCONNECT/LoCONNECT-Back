import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/common/users/users.entity';
import { MediaIntro } from './media_intro.entity';

@Entity('mediaStaffs')
export class MediaStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  companyName: string;

  @Column()
  programName: string;

  @Column()
  proofFile: string;

  @Column()
  department: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @Column()
  image: string;

  @OneToMany(() => MediaIntro, (intro) => intro.mediaStaff)
  intros: MediaIntro[];
}
