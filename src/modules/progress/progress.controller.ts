// src/modules/progress/progress.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiBody } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Progress')
@ApiBearerAuth('JWT-auth')
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @ApiOperation({ summary: 'Get semua progress user' })
  @SwaggerResponse({ status: 200, description: 'Data progress user' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProgress(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    if (page && limit) {
      const paginate = await this.progressService.pagination(req.user._id, Number(page) || 1, Number(limit) || 10, status);
      return ApiResponse.success(paginate, 'Data progress user (paginated)');
    }
    const data = await this.progressService.getUserProgress(req.user._id);
    return ApiResponse.success(data, 'Data progress user');
  }

  @ApiOperation({ summary: 'Get statistik user (total lesson, XP, dll)' })
  @SwaggerResponse({ status: 200, description: 'Data statistik user' })
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    const data = await this.progressService.getStats(req.user._id);
    return ApiResponse.success(data, 'Data statistik user');
  }

  @ApiOperation({ summary: 'Get progress lesson tertentu' })
  @SwaggerResponse({ status: 200, description: 'Data progress lesson' })
  @UseGuards(JwtAuthGuard)
  @Get('lesson/:lessonId')
  async getLessonProgress(@Request() req, @Param('lessonId') lessonId: string) {
    const data = await this.progressService.getLessonProgress(req.user._id, lessonId);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Mulai lesson baru' })
  @SwaggerResponse({ status: 201, description: 'Lesson dimulai' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        levelId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        lessonId: { type: 'string', example: '507f1f77bcf86cd799439012' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startLesson(@Request() req, @Body() body: { levelId: string; lessonId: string }) {
    const data = await this.progressService.startLesson(req.user._id, body.levelId, body.lessonId);
    return ApiResponse.created(data, 'Lesson dimulai');
  }

  @ApiOperation({ summary: 'Selesaikan lesson' })
  @SwaggerResponse({ status: 200, description: 'Lesson selesai' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        score: { type: 'number', example: 85 },
        timeSpent: { type: 'number', example: 120, description: 'Dalam detik' },
        detailedProgress: {
          type: 'object',
          example: { correctAnswers: 8, totalQuestions: 10 },
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async completeLesson(@Request() req, @Body() body: any) {
    const data = await this.progressService.completeLesson(
      req.user._id,
      body.lessonId,
      body.score,
      body.detailedProgress,
      body.timeSpent,
    );
    return ApiResponse.success(data, 'Lesson selesai');
  }
}
