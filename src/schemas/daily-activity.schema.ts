// src/schemas/daily-activity.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DailyActivity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: Date })
  date!: Date; // Only date (no time)

  @Prop({ default: 0, min: 0 })
  lessonsCompleted!: number;

  @Prop({ default: 0, min: 0 })
  xpEarned!: number;

  @Prop({ default: 0, min: 0 })
  timeSpent!: number; // seconds

  @Prop({ default: 0, min: 0, max: 100 })
  accuracy!: number; // average accuracy for the day

  @Prop([{
    lessonId: { type: Types.ObjectId, ref: 'Lesson' },
    type: String,
    xp: Number,
    completedAt: Date,
    _id: false,
  }])
  activities!: Array<{
    lessonId: Types.ObjectId;
    type: string;
    xp: number;
    completedAt: Date;
  }>;
}

export const DailyActivitySchema = SchemaFactory.createForClass(DailyActivity);

// Compound unique index for user + date
DailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });
DailyActivitySchema.index({ userId: 1, createdAt: -1 });