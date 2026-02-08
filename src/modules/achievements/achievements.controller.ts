// src/modules/achievements/achievements.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiBody } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Achievements')
@ApiBearerAuth('JWT-auth')
@Controller('achievements')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @ApiOperation({ summary: 'Get semua achievement' })
  @SwaggerResponse({ status: 200, description: 'Data semua achievement' })
  @Get()
  async findAll() {
    const data = await this.achievementsService.findAll();
    return ApiResponse.success(data, 'Data semua achievement');
  }

  @ApiOperation({ summary: 'Get achievement user yang sedang login' })
  @SwaggerResponse({ status: 200, description: 'Achievement user' })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserAchievements(@Request() req) {
    const data = await this.achievementsService.getUserAchievements(req.user._id);
    return ApiResponse.success(data, 'Achievement user');
  }

  @ApiOperation({ summary: 'Buat achievement baru' })
  @SwaggerResponse({ status: 201, description: 'Achievement berhasil dibuat' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '7 Day Streak' },
        description: { type: 'string', example: 'Login 7 hari berturut-turut' },
        type: { type: 'string', example: 'streak' },
        criteria: { type: 'object', example: { threshold: 7 } },
        rarity: { type: 'string', example: 'rare' },
        icon: { type: 'string', example: 'streak-7' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    const data = await this.achievementsService.create(body);
    return ApiResponse.created(data, 'Achievement berhasil dibuat');
  }

  @ApiOperation({ summary: 'Check dan award achievement berdasarkan event' })
  @SwaggerResponse({ status: 201, description: 'Achievement check berhasil' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventType: { type: 'string', example: 'streak', description: 'Tipe event: streak, xp, completion, accuracy, speed' },
        value: { type: 'number', example: 7, description: 'Nilai yang dicapai user' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  async check(@Request() req, @Body() body: { eventType: string; value: number }) {
    const data = await this.achievementsService.checkAndAward(req.user._id, body.eventType, body.value);
    return ApiResponse.created(data, 'Achievement Check berhasil dilakukan');
  }
}
