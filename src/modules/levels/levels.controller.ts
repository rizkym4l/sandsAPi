// src/modules/levels/levels.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiBody } from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { Level } from '../../schemas/level.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @ApiOperation({ summary: 'Get semua level (with per-user completion)' })
  @SwaggerResponse({ status: 200, description: 'Data semua level' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const data = await this.levelsService.findAll(req.user._id);
    return ApiResponse.success(data, 'Data semua level');
  }

  @ApiOperation({ summary: 'Get level by ID (with per-user completion)' })
  @SwaggerResponse({ status: 200, description: 'Data level' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @Request() req) {
    const data = await this.levelsService.findById(id, req.user._id);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Get level by nomor level' })
  @SwaggerResponse({ status: 200, description: 'Data level' })
  @Get('number/:levelNumber')
  async findByLevelNumber(@Param('levelNumber') levelNumber: number) {
    const data = await this.levelsService.findByLevelNumber(levelNumber);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Buat level baru' })
  @SwaggerResponse({ status: 201, description: 'Level berhasil dibuat' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        levelNumber: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Huruf Dasar A-E' },
        description: { type: 'string', example: 'Belajar huruf dasar A sampai E' },
        difficulty: { type: 'string', example: 'beginner' },
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createLevelDto: Partial<Level>) {
    const data = await this.levelsService.create(createLevelDto);
    return ApiResponse.created(data, 'Level berhasil dibuat');
  }

  @ApiOperation({ summary: 'Update level by ID' })
  @SwaggerResponse({ status: 200, description: 'Level berhasil diupdate' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLevelDto: Partial<Level>) {
    const data = await this.levelsService.update(id, updateLevelDto);
    return ApiResponse.updated(data, 'Level berhasil diupdate');
  }

  @ApiOperation({ summary: 'Hapus level by ID' })
  @SwaggerResponse({ status: 200, description: 'Level berhasil dihapus' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.levelsService.delete(id);
    return ApiResponse.deleted('Level berhasil dihapus');
  }
}
