// src/schemas/lesson.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Lesson extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Level', required: true })
  levelId!: Types.ObjectId;

  @Prop({ 
    type: String,
    enum: ['learning', 'practice', 'quiz', 'camera-challenge'],
    required: true
  })
  type!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({
    type: {
      letters: { type: [String], default: [] }, // ['A', 'B', 'C']
      
      signImages: [{
        letter: String,
        imageUrl: String,
        description: String,
        _id: false,
      }],
      
      questions: [{
        questionType: {
          type: String,
          enum: ['image-to-text', 'text-to-image', 'multiple-choice']
        },
        imageUrl: String,
        correctAnswer: String,
        options: [String], // For multiple choice
        points: { type: Number, default: 10 },
        _id: false,
      }],
      
      challengeWords: { type: [String], default: [] }, // ['MAMA', 'PAPA']
    },
    required: true,
  })
  content!: {
    letters: string[];
    signImages: Array<{
      letter: string;
      imageUrl: string;
      description: string;
    }>;
    questions: Array<{
      questionType: string;
      imageUrl: string;
      correctAnswer: string;
      options: string[];
      points: number;
    }>;
    challengeWords: string[];
  };

  @Prop({
    type: {
      minAccuracy: { type: Number, default: 70, min: 0, max: 100 },
      timeLimit: { type: Number, default: null }, // seconds, null = no limit
    },
    default: {},
  })
  requirements!: {
    minAccuracy: number;
    timeLimit: number;
  };

  @Prop({
    type: {
      xpPoints: { type: Number, required: true, min: 0 },
      badge: { type: String, default: null },
    },
    required: true,
  })
  rewards!: {
    xpPoints: number;
    badge: string;
  };

  @Prop({ required: true })
  order!: number; // Order within the level

  @Prop({ default: 15 })
  estimatedDuration!: number; // minutes

  @Prop({ default: false })
  isCompleted!: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

// Indexes
LessonSchema.index({ levelId: 1, order: 1 });
LessonSchema.index({ type: 1 });