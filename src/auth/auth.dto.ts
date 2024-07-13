import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class SignInResponseDTO {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  role: number;

  @ApiProperty()
  token: string;
}
