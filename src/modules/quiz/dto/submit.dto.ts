import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  questionId!: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  userAnswer!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  timeSpent!: number;
}

class MistakeDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  position!: number;

  @ApiProperty({ example: 'B' })
  @IsString()
  expectedLetter!: string;

  @ApiProperty({ example: 'D' })
  @IsString()
  detectedLetter!: string;
}

class CameraChallengeDto {
  @ApiProperty({ example: 'HALO' })
  @IsString()
  word!: string;

  @ApiProperty({ type: [MistakeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MistakeDto)
  mistakes!: MistakeDto[];

  @ApiProperty({ example: 0.85 })
  @IsNumber()
  averageConfidence!: number;
}

export class SubmitDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  lessonId!: string;

  @ApiProperty({ example: 'quiz', enum: ['practice', 'quiz', 'camera-challenge'] })
  @IsEnum(['practice', 'quiz', 'camera-challenge'])
  quizType!: 'practice' | 'quiz' | 'camera-challenge';

  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];

  @ApiPropertyOptional({ type: CameraChallengeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CameraChallengeDto)
  cameraChallenge?: CameraChallengeDto;
}
