import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { getModelToken } from '@nestjs/mongoose';       // tambah ini
import { Lesson } from '../../schemas/lesson.schema';    // tambah ini
import { UserProgress } from '../../schemas/user-progress.schema';
describe('LessonsService', () => {
  let service: LessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getModelToken(Lesson.name),    // mock LessonModel
          useValue: {},
        },
        {
          provide: getModelToken(UserProgress.name), // mock UserProgressModel
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
