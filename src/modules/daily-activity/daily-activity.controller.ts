// src/modules/daily-activity/daily-activity.controller.ts
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiQuery } from '@nestjs/swagger';
import { DailyActivityService } from './daily-activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Daily Activity')
@ApiBearerAuth('JWT-auth')
@Controller('daily-activity')
export class DailyActivityController {
  constructor(private dailyActivityService: DailyActivityService) {}

  @ApiOperation({ summary: 'Get aktivitas hari ini' })
  @SwaggerResponse({ status: 200, description: 'Aktivitas hari ini' })
  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getToday(@Request() req) {
    const data = await this.dailyActivityService.getToday(req.user._id);
    return ApiResponse.success(data, 'Aktivitas hari ini');
  }

  @ApiOperation({ summary: 'Get riwayat aktivitas' })
  @SwaggerResponse({ status: 200, description: 'Riwayat aktivitas' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 30, description: 'Jumlah hari ke belakang (default 30)' })
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Request() req, @Query('days') days?: number) {
    const data = await this.dailyActivityService.getHistory(req.user._id, days || 30);
    return ApiResponse.success(data, 'Riwayat aktivitas');
  }

  @ApiOperation({ summary: 'Get streak user' })
  @SwaggerResponse({ status: 200, description: 'Data streak' })
  @UseGuards(JwtAuthGuard)
  @Get('streak')
  async getStreak(@Request() req) {
    const streak = await this.dailyActivityService.getStreak(req.user._id);
    return ApiResponse.success({ streak }, 'Data streak');
  }
}
