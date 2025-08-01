import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaStaff } from './media_staff.entity';
@Injectable()
export class MediaStaffService {
     constructor(
        @InjectRepository(MediaStaff)
        private mediaStaffRepo: Repository<MediaStaff>,
      ) {}

      async getMedia(id:number):Promise<{}>{
        return {}
      }
}
