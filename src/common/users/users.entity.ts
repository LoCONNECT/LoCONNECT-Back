import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  BIZ = 'biz',
  MEDIA = 'media',
  INFLUENCER = 'influ',
  ADMIN = 'admin',
}

export enum UserAccept {
  ACCEPT = 'accept',
  REJECT = 'reject',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  name: string;

  @Column({ name: 'login_id', unique: true })
  loginId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ default: false })
  agreeRequired: boolean;

  @Column({ default: false })
  agreeOptional: boolean;

  @Column({ type: 'enum', enum: UserAccept, default: UserAccept.PENDING })
  acceptStatus: UserAccept;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
