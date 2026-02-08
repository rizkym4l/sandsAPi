// src/modules/achievements/achievements.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement } from '../../schemas/achievment.schema';
import { UserAchievement } from '../../schemas/user-achievment.schema';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<Achievement>,
    @InjectModel(UserAchievement.name)
    private userAchievementModel: Model<UserAchievement>,
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.find().sort({ rarity: 1 }).exec();
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementModel
      .find({ userId })
      .populate('achievementId')
      .sort({ unlockedAt: -1 })
      .exec();
  }

  async create(data: Partial<Achievement>): Promise<Achievement> {
    const achievement = new this.achievementModel(data);
    return achievement.save();
  }

  async checkAndAward(
    userId: string,
    eventType: string,
    value: number,
  ): Promise<UserAchievement[]> {
    let userAchievment: any;
    const achievment = await this.achievementModel.find({ type: eventType });
    let unlock: any[] = [];
    for (const ach of achievment) {
      userAchievment = await this.userAchievementModel
        .findOne({
          userId,
          achievementId: ach._id,
        })
        .populate('achievementId');

      if (!userAchievment) {
        const iscomplete = value >= ach.criteria.threshold ? true : false;
        const data = await this.userAchievementModel.create({
          userId,
          achievementId: ach._id,
          progress: value,
          isCompleted: iscomplete,
          unlockedAt: iscomplete ? new Date() : null,
        });
        if (iscomplete) {
          unlock.push(data);
        }
      } else if (userAchievment.progress >= ach.criteria.threshold) {
        userAchievment.isCompleted = true;
        userAchievment.unlockedAt = new Date();
        await userAchievment.save();
        unlock.push(userAchievment);
      } else {
        const newProg = userAchievment.progress + value;
        const iscomplete = newProg >= ach.criteria.threshold ? true : false;
        const data = await this.userAchievementModel
          .findByIdAndUpdate(userAchievment._id, {
            progress: newProg,
            isCompleted: iscomplete,
            unlockedAt: iscomplete ? new Date() : null,
          })
          .exec();
        if (iscomplete) {
          unlock.push(data);
        }
      }
    }

    return unlock;
  }
}
