// src/modules/lessons/lessons.controller.ts
import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { Lesson } from '../../schemas/lesson.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Get semua lesson' })
  @SwaggerResponse({ status: 200, description: 'Data semua lesson' })
  @Get()
  async findAll() {
    const data = await this.lessonsService.findAll();
    return ApiResponse.success(data, 'Data semua lesson');
  }

  @ApiOperation({ summary: 'Get lesson by ID' })
  @SwaggerResponse({ status: 200, description: 'Data lesson' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.lessonsService.findById(id);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Get lessons by level ID' })
  @SwaggerResponse({ status: 200, description: 'Data lesson berdasarkan level' })
  @Get('level/:levelId')
  async findByLevelId(@Param('levelId') levelId: string) {
    const data = await this.lessonsService.findByLevelId(levelId);
    return ApiResponse.success(data, 'Data lesson berdasarkan level');
  }

  @ApiOperation({ summary: 'Get lessons by type (learning/practice/quiz)' })
  @SwaggerResponse({ status: 200, description: 'Data lesson berdasarkan type' })
  @Get('type/:type')
  async findByType(@Param('type') type: string) {
    const data = await this.lessonsService.findByType(type);
    return ApiResponse.success(data, 'Data lesson berdasarkan type');
  }

  @ApiOperation({ summary: 'Buat lesson baru' })
  @SwaggerResponse({ status: 201, description: 'Lesson berhasil dibuat' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        levelId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'Belajar Huruf A' },
        type: { type: 'string', example: 'learning' },
        order: { type: 'number', example: 1 },
        content: { type: 'object', example: { letters: ['A', 'B', 'C'] } },
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createLessonDto: Partial<Lesson>) {
    const data = await this.lessonsService.create(createLessonDto);
    return ApiResponse.created(data, 'Lesson berhasil dibuat');
  }

  @ApiOperation({ summary: 'Update lesson by ID' })
  @SwaggerResponse({ status: 200, description: 'Lesson berhasil diupdate' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLessonDto: Partial<Lesson>) {
    const data = await this.lessonsService.update(id, updateLessonDto);
    return ApiResponse.updated(data, 'Lesson berhasil diupdate');
  }

  @ApiOperation({ summary: 'Complete lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID', example: '507f1f77bcf86cd799439011' })
  @SwaggerResponse({ status: 200, description: 'Lesson berhasil diselesaikan' })
  @SwaggerResponse({ status: 404, description: 'Lesson tidak ditemukan' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  async completeLesson(@Param('id') id: string, @Request() req) {
    const data = await this.lessonsService.completeLesson(id, req.user._id);
    return ApiResponse.updated(data, 'Lesson berhasil diselesaikan');
  }

  @ApiOperation({ summary: 'Hapus lesson by ID' })
  @SwaggerResponse({ status: 200, description: 'Lesson berhasil dihapus' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.lessonsService.delete(id);
    return ApiResponse.deleted('Lesson berhasil dihapus');
  }
}
