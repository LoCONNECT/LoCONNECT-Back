import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class MediaStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  companyName: string;

  @Column()
  programName: string;

  @Column()
  employmentCert: string;
  // 재직증명서 파일

  @Column()
  department: string;

  @Column()
  companyAddress: string;

  @Column()
  companyEmail: string;

  @Column({ type: 'text' })
  purpose: string;
}
