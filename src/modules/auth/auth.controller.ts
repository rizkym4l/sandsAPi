// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponse } from '../../common/response.helper';
import { Throttle } from '@nestjs/throttler';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register user baru' })
  @SwaggerResponse({ status: 201, description: 'Registrasi berhasil' })
  @SwaggerResponse({ status: 400, description: 'Validasi gagal / email sudah terdaftar' })
  @Throttle({default:{ttl:60000,limit:5}})
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.register(registerDto);
    res.cookie('refresh_token', data.refresh_token, COOKIE_OPTIONS);
    const { refresh_token: _, ...responseData } = data;
    return ApiResponse.created(responseData, 'Registrasi berhasil');
  }

  @Throttle({default:{ttl:60000,limit:5}})
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    const data = await this.authService.verifyEmail(token);
    return ApiResponse.success(data, 'verify berhasil');
  }

  @Throttle({default:{ttl:60000,limit:5}})
  @ApiOperation({ summary: 'Login user' })
  @SwaggerResponse({ status: 200, description: 'Login berhasil, return JWT token' })
  @SwaggerResponse({ status: 401, description: 'Email atau password salah' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(loginDto);
    res.cookie('refresh_token', data.refresh_token, COOKIE_OPTIONS);
    const { refresh_token: _, ...responseData } = data;
    return ApiResponse.success(responseData, 'Login berhasil');
  }

  @Throttle({default:{ttl:60000,limit:5}})
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const data = await this.authService.forgotPassword(email);
    return ApiResponse.success(data);
  }

  @Throttle({default:{ttl:60000,limit:5}})
  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    const data = await this.authService.resetPassword(newPassword, token);
    return ApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Get profile user yang sedang login' })
  @SwaggerResponse({ status: 200, description: 'Data profile user' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const data = await this.authService.getProfile(req.user._id);
    return ApiResponse.success(data);
  }

  @Post('refresh-token')
  async refreshToken(@Request() req) {
    const token = req.cookies?.refresh_token;
    const access_token = await this.authService.refreshToken(token);
    return ApiResponse.success({ access_token }, 'Token berhasil diperbarui');
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { path: '/' });
    return ApiResponse.success(null, 'Logout berhasil');
  }
}
