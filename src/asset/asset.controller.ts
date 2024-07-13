import {
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { ASSET_PATH } from 'src/constant/env';
import * as sharp from 'sharp';
import { AssetUploadResponse } from './asset.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RestResponse } from 'src/commons/restResponse';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { Public } from 'src/auth/guard.auth';

@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  @ApiExtraModels(AssetUploadResponse)
  @RestResponse(AssetUploadResponse)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: { fieldSize: 1024 * 1024 * 20 },
    }),
  )
  uploadAsset(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): AssetUploadResponse {
    const destinationPath = ASSET_PATH;
    // const filename = file.originalname;
    // const fileExt = filename.split('.').at(-1);
    const newFilename = `${Date.now()}.webp`;
    const s = sharp(file.buffer);

    const isDirectoryExist = existsSync(destinationPath);
    if (!isDirectoryExist) {
      mkdirSync(destinationPath, { recursive: true });
    }

    s.resize(1000)
      .webp()
      .toFile(path.join(destinationPath, newFilename), (err) => {
        if (err) {
          console.error(err);
          throw new InternalServerErrorException(err);
        }
      });

    return {
      filename: newFilename,
    };
  }

  @Public()
  @Get(':filename')
  async getAsset(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const isFileExist = existsSync(path.join(ASSET_PATH, filename));
    if (!isFileExist) {
      throw new NotFoundException('File Not Found');
    }
    const file = createReadStream(path.join(ASSET_PATH, filename));
    const ext = filename.split('.').at(-1);
    res.set({
      'Content-Type': `image/${ext}`,
      'Content-Disposition': `attachment; filename=${filename}`,
    });
    return new StreamableFile(file);
  }
}
