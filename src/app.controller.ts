import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExtraModels, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RestResponseArray } from './commons/restResponse';
import { Public } from './auth/guard.auth';

export class MessageResponse {
  @ApiProperty({ example: 'Service Alive', default: 'Service Alive', type: String })
  message: string;
}

@Controller()
@ApiTags('ROOT')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExtraModels(MessageResponse)
  @RestResponseArray(MessageResponse)
  @Public()
  @Get()
  getHello(): MessageResponse {
    return {
      message: 'Service Alive',
    };
  }

  @Public()
  @Get('error')
  getError() {
    throw new BadRequestException('INTERCEPTOR REQUEST');
  }
}
