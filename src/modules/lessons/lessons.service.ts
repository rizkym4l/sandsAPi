// src/modules/lessons/lessons.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from '../../schemas/lesson.schema';
import { UserProgress } from '../../schemas/user-progress.schema';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    @InjectModel(UserProgress.name) private progressModel: Model<UserProgress>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel
      .find()
      .sort({ levelId: 1, order: 1 })
      .exec();
  }
  async pagination(page: number, limit:number): Promise<{data:Lesson[],total : number,page:number,totalPage:number}> {
    const data = await this.lessonModel
      .find()
      .sort({ levelId: 1, order: 1 })
      .skip((page-1)*limit)
      .limit(limit)
      .exec();

    const total = await this.lessonModel.countDocuments().exec();
    const totalPage = Math.ceil(total / limit)

    
    return {
      data: data,
      total : total,
      page : page,
      totalPage : totalPage
    }

  }

  async findById(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id).exec();

    if (!lesson) {
      throw new NotFoundException('Lesson tidak ditemukan');
    }
    return lesson;
  }

async findByLevelId(levelId: string): Promise<Lesson[]> {
  const data = await this.lessonModel.find();
  return data.filter((da) => da.levelId.toString() === levelId);
}


  async findByType(type: string): Promise<Lesson[]> {
    return this.lessonModel
      .find({ type })
      .sort({ levelId: 1, order: 1 })
      .exec();
  }

  async create(createLessonDto: Partial<Lesson>): Promise<Lesson> {
    const lesson = new this.lessonModel(createLessonDto);
    return lesson.save();
  }

  async update(id: string, updateLessonDto: Partial<Lesson>): Promise<Lesson> {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .exec();

    if (!lesson) {
      throw new NotFoundException('Lesson tidak ditemukan');
    }
    return lesson;
  }

  async completeLesson(id: string, userId: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException('Lesson tidak ditemukan');
    }

    // Save completion in UserProgress (per-user), NOT on the shared Lesson doc
    const existing = await this.progressModel.findOne({ userId, lessonId: id }).exec();
    if (existing) {
      existing.status = 'completed';
      existing.completedAt = new Date();
      await existing.save();
    } else {
      await this.progressModel.create({
        userId,
        levelId: lesson.levelId,
        lessonId: id,
        status: 'completed',
        completedAt: new Date(),
        attempts: 1,
      });
    }

    return lesson;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.lessonModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Lesson tidak ditemukan');
    }
    return { message: 'Lesson berhasil dihapus' };
  }
}
