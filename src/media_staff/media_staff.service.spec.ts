import { Test, TestingModule } from '@nestjs/testing';
import { MediaStaffService } from './media_staff.service';

describe('MediaStaffService', () => {
  let service: MediaStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaStaffService],
    }).compile();

    service = module.get<MediaStaffService>(MediaStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
