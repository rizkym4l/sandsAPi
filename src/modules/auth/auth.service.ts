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
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private UserAchievement: AchievementsService,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

    const verifyToken = crypto.randomBytes(32).toString('hex')
    await this.usersService.updateById(user._id.toString(),{verifyToken})
    // Generate token
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verrify your email for SignMaster',
      text: `This is your verification token: ${verifyToken}`,
    })
    const {access_token,refresh_token} = this.generateToken(user);
    await this.usersService.updateById(user._id.toString(),{refreshToken : refresh_token})
    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
      },
      access_token: access_token,
      refresh_token: refresh_token
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
    const {access_token,refresh_token} = this.generateToken(user);
    await this.usersService.updateById(user._id.toString(),{refreshToken : refresh_token})

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        isVerified:user.isVerified
      },
      access_token: access_token,
      refresh_token: refresh_token
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

  private generateToken(user: any): {access_token:string,refresh_token:string} {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };
    const access_token =this.jwtService.sign(payload,{expiresIn:'15m'});
    const refresh_token = this.jwtService.sign(payload,{expiresIn:'7d'});
    return {access_token : access_token,refresh_token : refresh_token}
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
  async verifyEmail(token: string) {
    const user = await this.usersService.findUserbyVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Token tidak valid');
    }
    const updatedUser = await this.usersService.updateById(user._id.toString(),{isVerified:true,verifyToken:null})
    return updatedUser
  }

  async forgotPassword(email: string): Promise<{message:string}> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return {message : 'jika email terdaftar, token reset password akan dikirimkan'}
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    await this.usersService.updateById(user._id.toString(),{resetToken})
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password for SignMaster',
      text: `Token : ${resetToken}`
    });

    return {message : 'jika email terdaftar, token reset password akan dikirimkan'}
  }

  async resetPassword(password:string,resetToken:string ){
    const user = await this.usersService.findUserbyResetToken(resetToken);
    if (!user) {
      throw new UnauthorizedException('Token tidak valid');
    }
    const hashedPassword =await bcrypt.hash(password, 10);
    await this.usersService.updateById(user._id.toString(),{password:hashedPassword,resetToken:null})
    return {message:"Reset password berhasil"}
  }

  async refreshToken(refreshToken: string) {
    const user = await this.usersService.findUserbyRefreshToken(refreshToken);
    if(!user){
      throw new UnauthorizedException('Refresh token tidak valid');
    }
    const {access_token} = this.generateToken(user)
    return access_token
  }
}
