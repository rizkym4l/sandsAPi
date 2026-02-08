// src/schemas/user-progress.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserProgress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Level', required: true })
  levelId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
  lessonId!: Types.ObjectId;

  @Prop({ 
    type: String,
    enum: ['locked', 'in-progress', 'completed'],
    default: 'locked'
  })
  status!: string;

  @Prop({ default: 0, min: 0 })
  attempts!: number;

  @Prop({ default: 0, min: 0, max: 100 })
  bestScore!: number; // percentage

  @Prop({ default: 0, min: 0, max: 100 })
  lastScore!: number; // percentage

  @Prop({ default: 0, min: 0 })
  timeSpent!: number; // seconds

  @Prop({ type: Date, default: null })
  completedAt!: Date;

  @Prop({ type: Date, default: null })
  lastAttemptAt!: Date;

  @Prop({
    type: {
      correctAnswers: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }, // percentage
      lettersMastered: { type: [String], default: [] },
      lettersNeedPractice: { type: [String], default: [] },
    },
    default: {},
  })
  detailedProgress!: {
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    lettersMastered: string[];
    lettersNeedPractice: string[];
  };
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);

// Compound index for unique user+level+lesson combination
UserProgressSchema.index({ userId: 1, levelId: 1, lessonId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, status: 1 });
UserProgressSchema.index({ completedAt: -1 });