import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/users/users.entity';
import { Influencer } from '../influencer/influencer.entity';
import { MediaStaff } from '../media_staff/media_staff.entity';
import { StoreOwner } from '../store_owner/entity/store_owners.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,

    @InjectRepository(MediaStaff)
    private mediaRepo: Repository<MediaStaff>,

    @InjectRepository(Influencer)
    private influRepo: Repository<Influencer>,
  ) {}
}
