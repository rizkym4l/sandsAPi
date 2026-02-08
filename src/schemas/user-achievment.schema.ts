// src/schemas/user-achievement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserAchievement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Achievement', required: true })
  achievementId!: Types.ObjectId;

  @Prop({ type: Date, default: null,required:false })
  unlockedAt?: Date | null;

  @Prop({ default: 0, min: 0, max: 1000 })
  progress!: number; // 0-100%

  @Prop({ default: false })
  isCompleted!: boolean;
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);

// Compound unique index
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
UserAchievementSchema.index({ userId: 1, isCompleted: 1 });