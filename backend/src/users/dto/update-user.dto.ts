import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {

  
  @ApiProperty({ description: 'id ผู้ใช้' })
  @IsString()
  id: number; 

  @ApiProperty({ description: 'ชื่อผู้ใช้' })
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'นามสกุล' })
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'วันเกิด (YYYY-MM-DD)' })
  @IsDateString()
  birthday: string;

  @ApiProperty({ description: 'อีเมลผู้ใช้' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'หมายเลขโทรศัพท์' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'UUID ของผู้ใช้', default: '' })
  @IsString()
  @IsOptional()
  uuid?: string;
}
