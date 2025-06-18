import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { Program } from 'src/program/program.entity';

@Entity('mediaStaffs')
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
  proofFile: string;
  // 재직증명서 파일

  @Column()
  department: string;

  @Column()
  companyAddress: string;

  @Column()
  companyEmail: string;

  @Column({ type: 'text' })
  purpose: string;

  @OneToMany(() => Program, (program) => program.mediaStaff)
  programs: Program[];
}
