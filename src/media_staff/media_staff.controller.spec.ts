import { Test, TestingModule } from '@nestjs/testing';
import { MediaStaffController } from './media_staff.controller';

describe('MediaStaffController', () => {
  let controller: MediaStaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaStaffController],
    }).compile();

    controller = module.get<MediaStaffController>(MediaStaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
