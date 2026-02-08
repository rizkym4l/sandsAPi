// src/schemas/level.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Level extends Document {
  @Prop({ required: true, unique: true, min: 1 })
  levelNumber!: number;

  @Prop({ required: true, trim: true })
  title!: string; // "Huruf A-E"

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  requiredXP!: number; // XP needed to unlock this level

  @Prop({ required: true, min: 0 })
  xpReward!: number; // XP earned when completing this level

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lesson' }], default: [] })
  lessons!: Types.ObjectId[];

  @Prop({ 
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  })
  difficulty!: string;

  @Prop({
    type: {
      previousLevel: { type: Types.ObjectId, ref: 'Level', default: null },
      minAccuracy: { type: Number, default: 70, min: 0, max: 100 },
    },
    default: {},
  })
  unlockRequirements!: {
    previousLevel: Types.ObjectId;
    minAccuracy: number;
  };

  @Prop({ required: true, unique: true })
  order!: number; // Display order (1, 2, 3, ...)

  @Prop({ default: true })
  isActive!: boolean;
}

export const LevelSchema = SchemaFactory.createForClass(Level);

// Indexes
LevelSchema.index({ levelNumber: 1 });
LevelSchema.index({ order: 1 });
LevelSchema.index({ isActive: 1, order: 1 });