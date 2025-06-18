import { MediaStaff } from 'src/users/entity/media_staffs.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MediaStaff, (media) => media.programs)
  mediaStaff: MediaStaff;

  @Column()
  programName: string;

  @Column()
  introduction: string;

  @Column()
  minPromotionPrice: number;

  @Column()
  programImage: string;
}
