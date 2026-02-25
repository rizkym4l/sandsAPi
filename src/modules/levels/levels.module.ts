 // src/modules/levels/levels.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { Level, LevelSchema } from '../../schemas/level.schema';
import { UserProgress, UserProgressSchema } from '../../schemas/user-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Level.name, schema: LevelSchema },
      { name: UserProgress.name, schema: UserProgressSchema },
    ]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {}
