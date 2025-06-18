import { Test, TestingModule } from '@nestjs/testing';
import { StoreOwnerService } from './store_owner.service';

describe('StoreOwnerService', () => {
  let service: StoreOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreOwnerService],
    }).compile();

    service = module.get<StoreOwnerService>(StoreOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
