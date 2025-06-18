import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  OWNER = 'owner',
  MEDIA = 'media',
  INFLUENCER = 'influencer',
}

export enum UserAccept {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ default: false })
  termsAgreed: boolean;

  @Column({ type: 'enum', enum: UserAccept, default: UserAccept.REJECT })
  acceptStatus: UserAccept;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
