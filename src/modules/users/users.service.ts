// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Level } from '../../schemas/level.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Level.name) private levelModel: Model<Level>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async pagination(page: number, limit: number): Promise<{data: User[], total: number, page: number, totalPage: number}> {
    const data = await this.userModel
      .find()
      .select('-password')
      .sort({ 'stats.totalXP': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.userModel.countDocuments().exec();
    const totalPage = Math.ceil(total / limit);
    return { data, total, page, totalPage };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findUserbyVerificationToken(verifyToken: string):Promise<User | null>{
    return this.userModel.findOne({verifyToken}).exec()
  }
  async findUserbyResetToken(resetToken: string):Promise<User | null>{
    return this.userModel.findOne({resetToken}).exec()
  }
  async findUserbyRefreshToken(refreshToken: string):Promise<User | null>{
    return this.userModel.findOne({refreshToken}).exec()
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }
  async updateById(id:string,data:Partial<User>){
    return this.userModel.findByIdAndUpdate(id,data,{new:true}).exec( )
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { 
        $set: {
          'profile.displayName': updateProfileDto.displayName,
          'profile.bio': updateProfileDto.bio
        }
      },
      { new: true },
    ).exec();
    if (!user) {
     throw new NotFoundException('User Tidak ditemukan!');

    }

    return user
  }

  async updateXP(userId: string, xp: number): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { 'stats.totalXP': xp } },
      { new: true },
    ).exec();
    if (!user) {
        throw new NotFoundException("User Tidak ditemukan")
    }

    // Auto level progression: find highest level the user qualifies for
    const levels = await this.levelModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .exec();

    let newLevel = 1;
    for (const level of levels) {
      if (user.stats.totalXP >= level.requiredXP) {
        newLevel = level.levelNumber;
      } else {
        break;
      }
    }

    if (newLevel !== user.stats.currentLevel) {
      user.stats.currentLevel = newLevel;
      await user.save();
    }

    return user;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return { message: 'User berhasil dihapus' };
  }

  async getLeaderboard(limit: number = 100) {
    return this.userModel
      .find()
      .select('username profile.displayName profile.avatar stats.totalXP')
      .sort({ 'stats.totalXP': -1 })
      .limit(limit)
      .exec();
  }

 
}