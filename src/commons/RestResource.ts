import { ApiProperty } from '@nestjs/swagger';

export class RestResource<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isError: boolean;

  @ApiProperty({ type: 'object' })
  data: T | null;
}
