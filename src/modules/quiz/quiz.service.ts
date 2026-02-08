// src/modules/quiz/quiz.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizResult } from '../../schemas/quiz-result.schema';
import { SubmitDto } from './dto/submit.dto';
import { Lesson } from 'src/schemas/lesson.schema';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class QuizService {
  constructor(
    private LessonService: LessonsService,
    @InjectModel(QuizResult.name) private quizResultModel: Model<QuizResult>,
  ) {}

  async getHistory(userId: string): Promise<QuizResult[]> {
    return this.quizResultModel
      .find({ userId })
      .populate('lessonId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getResultById(id: string): Promise<QuizResult | null> {
    return this.quizResultModel.findById(id).populate('lessonId').exec();
  }

  async submit(
    userId: string,
    submitData: SubmitDto,
  ): Promise<QuizResult> {
    const lesson = await this.LessonService.findById(submitData.lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson tidak ditemukan');
    }

    let score: number;
    let totalQuestions: number;
    let correctNum: number;
    let wrongNum: number;
    let totalTime = 0;
    let processedAnswers: any[] = [];

    if (submitData.quizType === 'camera-challenge') {
      // Camera challenge: score dari averageConfidence, mistakes jadi wrongAnswers
      const camera = submitData.cameraChallenge;
      const wordLength = camera?.word.length || 0;
      const mistakeCount = camera?.mistakes.length || 0;

      totalQuestions = wordLength;
      wrongNum = mistakeCount;
      correctNum = wordLength - mistakeCount;
      if (submitData.cameraChallenge?.averageConfidence) {
        score = (submitData.cameraChallenge?.averageConfidence * 0.7) + ((correctNum / totalQuestions) * 100 * 0.3)
      }else{
        score = submitData.cameraChallenge!.averageConfidence
      }

    } else {
      // Quiz / Practice: score dari jawaban benar
      const questions = lesson.content.questions;

      processedAnswers = submitData.answers.map((ans, index) => {
        const question = questions[index];
        const isCorrect = ans.userAnswer === question?.correctAnswer;

        if (isCorrect) correctNum++;
        totalTime += ans.timeSpent;

        return {
          questionId: ans.questionId,
          userAnswer: ans.userAnswer,
          correctAnswer: question?.correctAnswer || '',
          isCorrect,
          timeSpent: ans.timeSpent,
        };
      });

      correctNum = processedAnswers.filter((a) => a.isCorrect).length;
      totalQuestions = questions.length;
      wrongNum = totalQuestions - correctNum;
      score = (correctNum / totalQuestions) * 100;
    }


    const quizResult = await this.quizResultModel.create({
      userId,
      lessonId: submitData.lessonId,
      quizType: submitData.quizType,
      score : score,
      totalQuestions,
      correctAnswers: correctNum,
      wrongAnswers: wrongNum,
      timeSpent: totalTime,
      xpEarned : lesson.rewards.xpPoints,
      answers: processedAnswers,
      cameraChallenge: submitData.cameraChallenge || null,
      completedAt: new Date(),
    });

    return quizResult;
  }
}
