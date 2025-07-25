import { User } from 'src/common/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

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
  proofFile: string; // 재직증명서 파일 경로

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
}
