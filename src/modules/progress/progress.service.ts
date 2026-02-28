// src/modules/progress/progress.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProgress } from '../../schemas/user-progress.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(UserProgress.name) private progressModel: Model<UserProgress>,
    private usersService: UsersService,
  ) { }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.progressModel
      .find({ userId })
      .populate('levelId')
      .populate('lessonId')
      .sort({ levelId: 1, lessonId: 1 })
      .exec();
  }

  async pagination(userId: string, page: number, limit: number, status?: string): Promise<{data:UserProgress[], total:number, page:number, totalPage:number}> {
    const filter: Record<string, any> = { userId };
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      this.progressModel
        .find(filter)
        .populate('lessonId', 'title rewards type')
        .sort({ completedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.progressModel.countDocuments(filter).exec(),
    ]);
    const totalPage = Math.ceil(total / limit);
    return { data, total, page, totalPage };
  }

  async getLessonProgress(
    userId: string,
    lessonId: string,
  ): Promise<UserProgress | null> {
    return this.progressModel.findOne({ userId, lessonId }).exec();
  }

  async startLesson(
    userId: string,
    levelId: string,
    lessonId: string,
  ): Promise<UserProgress> {
    const existing = await this.progressModel
      .findOne({ userId, lessonId })
      .exec();

    if (existing) {
      existing.status = 'in-progress';
      existing.lastAttemptAt = new Date();
      existing.attempts += 1;
      return existing.save();
    }

    const progress = new this.progressModel({
      userId,
      levelId,
      lessonId,
      status: 'in-progress',
      attempts: 1,
      lastAttemptAt: new Date(),
    });
    return progress.save();
  }

  async completeLesson(
    userId: string,
    lessonId: string,
    score: number,
    detailedProgress: any,
    timeSpent: number,
  ): Promise<UserProgress> {
    const existing = await this.progressModel.findOne({ userId, lessonId }).exec();

    if (!existing) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    const progress = await this.progressModel.findByIdAndUpdate(
      existing._id,
      {
        status: 'completed',
        lastScore: score,
        bestScore: Math.max(score, existing.bestScore),
        timeSpent,
        completedAt: new Date(),
        detailedProgress
      },
      { new: true }
    );

    await this.usersService.updateXP(userId, Math.round(score * 0.5));

    return progress!;
  }

  async getStats(userId: string) {
    const allProgress = await this.progressModel.find({ userId }).exec();
    const completed = allProgress.filter((p) => p.status === 'completed');

    return {
      totalLessons: allProgress.length,
      completedLessons: completed.length,
      averageScore:
        completed.length > 0
          ? completed.reduce((sum, p) => sum + p.bestScore, 0) /
          completed.length
          : 0,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpent, 0),
    };
  }
}
