import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateUser {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string | null;
}

export class ResponseUserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;
}
