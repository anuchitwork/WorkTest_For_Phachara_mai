import { IsString, IsEmail, IsOptional, IsDateString, IsUUID, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  // @ApiPropertyOptional({ description: 'User ID (optional)' })
  // @IsOptional()
  // @IsString()
  // id?: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Birthday in YYYY-MM-DD format' })
  @IsDateString()
  birthday: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber()
  phone: string;


}


export class UserDto {
  @ApiProperty()
  pid: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  phone: string;
}

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserDto] })
  users: UserDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ required: false })
  nextCursor?: number;
}

