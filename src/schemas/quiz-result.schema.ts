// src/schemas/quiz-result.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class QuizResult extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
  lessonId!: Types.ObjectId;

  @Prop({ 
    type: String,
    enum: ['practice', 'quiz', 'camera-challenge'],
    required: true
  })
  quizType!: string;

  @Prop({ required: true, min: 0, max: 100 })
  score!: number; // percentage

  @Prop({ required: true, min: 0 })
  totalQuestions!: number;

  @Prop({ required: true, min: 0 })
  correctAnswers!: number;

  @Prop({ required: true, min: 0 })
  wrongAnswers!: number;

  @Prop({ required: true, min: 0 })
  timeSpent!: number; // seconds

  @Prop({ required: true, min: 0 })
  xpEarned!: number;

  @Prop([{
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number,
    _id: false,
  }])
  answers!: Array<{
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;

  @Prop({
    type: {
      word: String,
      mistakes: [{
        position: Number,
        expectedLetter: String,
        detectedLetter: String,
        _id: false,
      }],
      averageConfidence: { type: Number, min: 0, max: 100 },
    },
    required: false,
    default: null,
  })
  cameraChallenge?: {
    word: string;
    mistakes: Array<{
      position: number;
      expectedLetter: string;
      detectedLetter: string;
    }>;
    averageConfidence: number;
  } | null;

  @Prop({ type: Date, default: Date.now })
  completedAt!: Date;
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);

// Indexes
QuizResultSchema.index({ userId: 1, createdAt: -1 });
QuizResultSchema.index({ lessonId: 1 });
QuizResultSchema.index({ score: -1 });  