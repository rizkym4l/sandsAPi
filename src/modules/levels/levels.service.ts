// src/modules/levels/levels.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level } from '../../schemas/level.schema';

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Level>,
  ) {}

  async findAll(): Promise<Level[]> {
    return this.levelModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .populate('lessons')
      .exec();
  }

  async findById(id: string): Promise<Level> {
    const level = await this.levelModel
      .findById(id)
      .populate('lessons')
      .exec();

    if (!level) {
      throw new NotFoundException('Level tidak ditemukan');
    }
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
