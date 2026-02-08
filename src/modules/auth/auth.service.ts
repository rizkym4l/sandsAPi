// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { isSameDay } from 'src/common/gateKnown';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private UserAchievement: AchievementsService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingEmail = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Check if username already exists
    const existingUsername = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const today = new Date();
    let isNewDayLogin = false;
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    if (lastLogin) {
      if (!isSameDay(lastLogin, today)) {
        isNewDayLogin = true;

        user.lastLoginDate = today;
        await user.save();
      }
    }
    if (isNewDayLogin) {
      await this.UserAchievement.checkAndAward(user._id.toString(), 'streak', 1);
    }
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
      },
      access_token: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return user;
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}
