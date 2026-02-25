// src/modules/users/users.controller.ts
import { Controller, Get, Put, Delete, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get leaderboard (top users by XP)' })
  @SwaggerResponse({ status: 200, description: 'Data leaderboard' })
  @Get('leaderboard')
  async getLeaderboard() {
    const data = await this.usersService.getLeaderboard();
    return ApiResponse.success(data, 'Data leaderboard');
  }

  @ApiOperation({ summary: 'Get semua user' })
  @SwaggerResponse({ status: 200, description: 'Data semua user' })
  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return ApiResponse.success(data, 'Data semua user');
  }

  @ApiOperation({ summary: 'Get user paginate' })
  @SwaggerResponse({ status: 200, description: 'Data user Paginate' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('paginate')
  async paginate(@Query('page') page: string, @Query('limit') limit: string) {
    const paginate = await this.usersService.pagination(Number(page), Number(limit));
    return paginate;
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @SwaggerResponse({ status: 200, description: 'Data user' })
  @SwaggerResponse({ status: 404, description: 'User tidak ditemukan' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.usersService.findById(id);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update profile user' })
  @SwaggerResponse({ status: 200, description: 'Profile berhasil diupdate' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.usersService.updateProfile(req.user._id, updateProfileDto);
    return ApiResponse.updated(data, 'Profile berhasil diupdate');
  }

  @ApiOperation({ summary: 'Update XP user' })
  @SwaggerResponse({ status: 200, description: 'XP berhasil diupdate' })
  @ApiBody({ schema: { type: 'object', properties: { xp: { type: 'number', example: 50 } } } })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put('xp')
  async updateXP(@Request() req, @Body('xp') xp: number) {
    const data = await this.usersService.updateXP(req.user._id, xp);
    return ApiResponse.updated(data, 'XP berhasil diupdate');
  }

  @ApiOperation({ summary: 'Hapus akun user' })
  @SwaggerResponse({ status: 200, description: 'Akun berhasil dihapus' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteAccount(@Request() req) {
    await this.usersService.delete(req.user._id);
    return ApiResponse.deleted('Akun berhasil dihapus');
  }
}
