import { ApiProperty } from '@nestjs/swagger';

export class AssetUploadResponse {
  @ApiProperty()
  filename: string;
}
