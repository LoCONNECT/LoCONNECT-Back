import { Program } from 'src/program/program.entity';
import { Influencer } from 'src/users/entity/influencers.entity';
import { MediaStaff } from 'src/users/entity/media_staffs.entity';
import { StoreOwner } from 'src/users/entity/store_owners.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ProposalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreOwner)
  storeOwner: StoreOwner;

  @ManyToOne(() => Influencer, { nullable: true })
  influencerPartner: Influencer;

  @ManyToOne(() => MediaStaff, { nullable: true })
  MediaStaff: MediaStaff;

  @Column()
  proposedPrice: number;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;
}
