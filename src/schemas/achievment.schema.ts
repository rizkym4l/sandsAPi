// src/schemas/achievement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Achievement extends Document {
 
  @Prop({
    type: String,
    enum: ['streak', 'xp', 'accuracy', 'speed', 'completion'],
    required: [true,'Type is Required']
  })
  type!: string;

  @Prop({ required: [true,'Name is Required'], unique: true })
  name!: string;

  @Prop({ required: [true,'description is requiref'] })
  description!: string;

  @Prop({ required: [true,'icon is requiref'] })
  icon!: string; // emoji or image URL

  @Prop({ required: [true,'badge is requiref'] })
  badge!: string; // badge image URL

  @Prop({
    type: {
      criteriaType: {
        type: String,
        enum: ['streak_days', 'total_xp', 'lesson_completed', 'perfect_score', 'speed_challenge'],
        required: [true, 'criteriaType is required']
      },
      threshold: { type: Number, required: [true, 'threshold is required'] },
    },
    required: [true, 'criteria is required'],
  })
  criteria!: {
    criteriaType: string;
    threshold: number;
  };

  @Prop({
    type: {
      xp: { type: Number, required: true, min: 0 },
      title: { type: String, default: null },
    },
    required: true,
  })
  rewards!: {
    xp: number;
    title: string;
  };

  @Prop({ 
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  })
  rarity!: string;
  
 
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);

// Indexes
AchievementSchema.index({ type: 1 });
AchievementSchema.index({ rarity: 1 });