import { Test, TestingModule } from '@nestjs/testing';
import { KeepController } from './keep.controller';

describe('KeepController', () => {
  let controller: KeepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeepController],
    }).compile();

    controller = module.get<KeepController>(KeepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
