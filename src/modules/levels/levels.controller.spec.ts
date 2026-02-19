import { Test, TestingModule } from '@nestjs/testing';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';

describe('LevelsController', () => {
  let controller: LevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelsController],
      providers: [
        {
          provide: LevelsService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByLevelNumber: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addLessonToLevel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LevelsController>(LevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
