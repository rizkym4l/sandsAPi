// src/modules/quiz/quiz.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { SubmitDto } from './dto/submit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Quiz')
@ApiBearerAuth('JWT-auth')
@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @ApiOperation({ summary: 'Get riwayat quiz user' })
  @SwaggerResponse({ status: 200, description: 'Quiz history' })
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Request() req) {
    const data = await this.quizService.getHistory(req.user._id);
    return ApiResponse.success(data, 'Quiz history');
  }

  @ApiOperation({ summary: 'Get hasil quiz by ID' })
  @SwaggerResponse({ status: 200, description: 'Data hasil quiz' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/results')
  async getResult(@Param('id') id: string) {
    const data = await this.quizService.getResultById(id);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Submit jawaban quiz' })
  @SwaggerResponse({ status: 201, description: 'Quiz berhasil disubmit' })
  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submit(@Request() req, @Body() body: SubmitDto) {
    const data = await this.quizService.submit(req.user._id, body);
    return ApiResponse.created(data, 'Quiz berhasil disubmit');
  }
}
