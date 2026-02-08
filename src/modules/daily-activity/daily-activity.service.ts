// src/modules/daily-activity/daily-activity.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyActivity } from '../../schemas/daily-activity.schema';

@Injectable()
export class DailyActivityService {
  constructor(
    @InjectModel(DailyActivity.name) private dailyActivityModel: Model<DailyActivity>,
  ) {}

  async getToday(userId: string): Promise<DailyActivity | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.dailyActivityModel.findOne({ userId, date: today }).exec();
  }

  async getHistory(userId: string, days: number = 30): Promise<DailyActivity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return this.dailyActivityModel
      .find({ userId, date: { $gte: startDate } })
      .sort({ date: -1 })
      .exec();
  }

  async getStreak(userId: string): Promise<number> {
    const activities = await this.dailyActivityModel
      .find({ userId })
      .sort({ date: -1 })
      .exec();

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < activities.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      const activityDate = new Date(activities[i].date);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async logActivity(
    userId: string,
    lessonId: string,
    type: string,
    xp: number,
    timeSpent: number,
    accuracy: number,
  ): Promise<DailyActivity> {
    // Get today's date (no time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's record
    let dailyActivity = await this.dailyActivityModel.findOne({ userId, date: today });

    if (!dailyActivity) {
      // Create new daily activity
      dailyActivity = await this.dailyActivityModel.create({
        userId,
        date: today,
        lessonsCompleted: 1,
        xpEarned: xp,
        timeSpent,
        accuracy,
        activities: [{
          lessonId,
          type,
          xp,
          completedAt: new Date()
        }]
      });
    } else {
      // Update existing daily activity
      const newLessonsCompleted = dailyActivity.lessonsCompleted + 1;
      const newXpEarned = dailyActivity.xpEarned + xp;
      const newTimeSpent = dailyActivity.timeSpent + timeSpent;

      // Calculate new average accuracy
      const totalAccuracy = dailyActivity.accuracy * dailyActivity.lessonsCompleted + accuracy;
      const newAccuracy = totalAccuracy / newLessonsCompleted;

      dailyActivity = await this.dailyActivityModel.findByIdAndUpdate(
        dailyActivity._id,
        {
          lessonsCompleted: newLessonsCompleted,
          xpEarned: newXpEarned,
          timeSpent: newTimeSpent,
          accuracy: newAccuracy,
          $push: {
            activities: {
              lessonId,
              type,
              xp,
              completedAt: new Date()
            }
          }
        },
        { new: true }
      );
    }

    return dailyActivity!;
  }
}
