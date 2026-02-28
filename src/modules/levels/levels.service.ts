// src/modules/levels/levels.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level } from '../../schemas/level.schema';
import { UserProgress } from '../../schemas/user-progress.schema';

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(UserProgress.name) private progressModel: Model<UserProgress>,
  ) {}

  /** Inject per-user isCompleted into each populated lesson */
  private async injectCompletion(levels: any[], userId?: string) {
    if (!userId) return levels;

    const completed = await this.progressModel
      .find({ userId, status: 'completed' })
      .select('lessonId')
      .lean()
      .exec();
    const completedSet = new Set(completed.map((p) => p.lessonId.toString()));

    for (const level of levels) {
      if (!level.lessons) continue;
      for (const lesson of level.lessons) {
        const lid = lesson._id?.toString?.() || lesson.toString();
        lesson.isCompleted = completedSet.has(lid);
      }
    }
    return levels;
  }

  async findAll(userId?: string): Promise<any[]> {
    const levels = await this.levelModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .populate('lessons')
      .lean()
      .exec();
    return this.injectCompletion(levels, userId);
  }

  async pagination(userId: string | undefined, page: number, limit: number): Promise<{data:any[], total:number, page:number, totalPage:number}> {
    const query = this.levelModel.find({ isActive: true }).sort({ order: 1 }).populate('lessons').lean();
    const data = await query.skip((page - 1) * limit).limit(limit).exec();
    const total = await this.levelModel.countDocuments({ isActive: true }).exec();
    const totalPage = Math.ceil(total / limit);
    const injected = await this.injectCompletion(data, userId);
    return { data: injected, total, page, totalPage };
  }

  async findById(id: string, userId?: string): Promise<any> {
    const level = await this.levelModel
      .findById(id)
      .populate('lessons')
      .lean()
      .exec();

    if (!level) {
      throw new NotFoundException('Level tidak ditemukan');
    }
    await this.injectCompletion([level], userId);
    return level;
  }

  async findByLevelNumber(levelNumber: number): Promise<Level> {
    const level = await this.levelModel
      .findOne({ levelNumber })
      .populate('lessons')
      .exec();

    if (!level) {
      throw new NotFoundException('Level tidak ditemukan');
    }
    return level;
  }

  async create(createLevelDto: Partial<Level>): Promise<Level> {
    const level = new this.levelModel(createLevelDto);
    return level.save();
  }

  async update(id: string, updateLevelDto: Partial<Level>): Promise<Level> {
    const level = await this.levelModel
      .findByIdAndUpdate(id, updateLevelDto, { new: true })
      .exec();

    if (!level) {
      throw new NotFoundException('Level tidak ditemukan');
    }
    return level;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.levelModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Level tidak ditemukan');
    }
    return { message: 'Level berhasil dihapus' };
  }

  async addLessonToLevel(levelId: string, lessonId: string): Promise<Level> {
    const level = await this.levelModel
      .findByIdAndUpdate(
        levelId,
        { $addToSet: { lessons: lessonId } },
        { new: true },
      )
      .exec();

    if (!level) {
      throw new NotFoundException('Level tidak ditemukan');
    }
    return level;
  }
}
