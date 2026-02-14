import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from 'src/schemas/user.schema';
import { Level, LevelSchema } from 'src/schemas/level.schema';
@Module({
  imports:[
    MongooseModule.forFeature([
      {name: User.name,schema : UserSchema},
      {name: Level.name, schema: LevelSchema},
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
