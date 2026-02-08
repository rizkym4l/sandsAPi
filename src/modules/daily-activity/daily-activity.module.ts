// src/modules/daily-activity/daily-activity.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyActivityController } from './daily-activity.controller';
import { DailyActivityService } from './daily-activity.service';
import { DailyActivity, DailyActivitySchema } from '../../schemas/daily-activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DailyActivity.name, schema: DailyActivitySchema }]),
  ],
  controllers: [DailyActivityController],
  providers: [DailyActivityService],
  exports: [DailyActivityService],
})
export class DailyActivityModule {}
