import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

describe('LessonsController', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByLevelId: jest.fn(),
            findByType: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            completeLesson: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
