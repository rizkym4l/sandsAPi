// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User> {
    const userAll = await this.userModel.find().exec()
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
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

    return user
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