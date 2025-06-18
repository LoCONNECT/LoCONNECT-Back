import { Test, TestingModule } from '@nestjs/testing';
import { KeepService } from './keep.service';

describe('KeepService', () => {
  let service: KeepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeepService],
    }).compile();

    service = module.get<KeepService>(KeepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
