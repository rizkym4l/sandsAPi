// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  username!: string;

  @Prop({ required: true, select: false }) // Don't return password by default
  password!: string;

  @Prop({
    type: {
      displayName: { type: String, default: '' },
      avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User',
      },
      bio: { type: String, default: '', maxlength: 200 },
      createdAt: { type: Date, default: Date.now },
    },
    default: {},
  })
  profile!: {
    displayName: string;
    avatar: string;
    bio: string;
    createdAt: Date;
  };

  @Prop({
    type: {
      totalXP: { type: Number, default: 0, min: 0 },
      currentLevel: { type: Number, default: 1, min: 1 },
      currentStreak: { type: Number, default: 0, min: 0 },
      longestStreak: { type: Number, default: 0, min: 0 },
      lastActiveDate: { type: Date },
    },
    default: {},
  })
  stats!: {
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date;
  };

  @Prop({
    type: {
      language: { type: String, default: 'id', enum: ['id', 'en'] },
      soundEnabled: { type: Boolean, default: true },
      notificationsEnabled: { type: Boolean, default: true },
    },
    default: {},
  })
  settings!: {
    language: string;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
  @Prop({
    default: new Date(),
  })
  lastLoginDate?: Date;

  @Prop({
    type: String,
    enum: ['user','admin'],
    default: 'user'
  })
  role!: string;

  @Prop({
    default:false
  })
  isVerified!: boolean;

  @Prop({type:String,default: null})
  verifyToken?:string | null;

  @Prop({type:String,default:null})
  resetToken!:string | null;

  @Prop({type:String,default:null})
  refreshToken!:string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'stats.totalXP': -1 }); // For leaderboard
UserSchema.index({ 'stats.lastActiveDate': -1 }); // For active users
