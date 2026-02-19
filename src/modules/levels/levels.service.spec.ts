import { Test, TestingModule } from '@nestjs/testing';
import { LevelsService } from './levels.service';
import { getModelToken } from '@nestjs/mongoose';
import { Level } from '../../schemas/level.schema';
import { UserProgress } from '../../schemas/user-progress.schema';

describe('LevelsService', () => {
  let service: LevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelsService,
        {
          provide: getModelToken(Level.name),
          useValue: {},
        },
        {
          provide: getModelToken(UserProgress.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LevelsService>(LevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
