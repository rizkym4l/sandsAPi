// src/modules/users/dto/update-profile.dto.ts
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ example: 'Saya sedang belajar bahasa isyarat' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  bio?: string;
}