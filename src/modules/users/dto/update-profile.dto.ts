// src/modules/users/dto/update-profile.dto.ts
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

function stripHtml(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @Transform(({ value }) => stripHtml(value))
  displayName?: string;

  @ApiPropertyOptional({ example: 'Saya sedang belajar bahasa isyarat' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @Transform(({ value }) => stripHtml(value))
  bio?: string;
}