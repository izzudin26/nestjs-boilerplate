import { Controller, Get, Post, Body, Patch, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ResponseUserDTO, UpdateUser } from './user.dto';
import { Roles } from 'src/auth/roles.auth';
import { Role } from 'src/auth/enum.auth';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RestResponse, RestResponseArray } from 'src/commons/restResponse';
import { RestRequest } from 'src/commons/restRequest';
import { AuthService } from 'src/auth/service.auth';

@ApiTags('User')
@Roles(Role.superAdmin)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiExtraModels(ResponseUserDTO)
  @ApiExtraModels(CreateUserDto)
  @RestResponse(ResponseUserDTO)
  @Post('create')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body).catch((err: Error) => {
      throw new BadRequestException(err.message);
    });

    const res: ResponseUserDTO = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      createdAt: user.createdAt,
    };

    return res;
  }

  @ApiExtraModels(ResponseUserDTO)
  @RestResponseArray(ResponseUserDTO)
  @Get()
  async findAllUser() {
    const snapshot = await this.userService.findAll();
    const users: ResponseUserDTO[] = snapshot.map((u) => ({
      id: u.id,
      fullname: u.fullname,
      username: u.username,
      createdAt: u.createdAt,
    }));

    return users;
  }

  @ApiExtraModels(UpdateUser)
  @ApiExtraModels(UpdateUser)
  @RestResponse(ResponseUserDTO)
  @RestRequest(UpdateUser)
  @Patch(':id')
  async updateSomeUser(@Param('id') id: number, @Body() body: UpdateUser) {
    const user = await this.userService.update(id, body).catch((err: Error) => {
      throw new BadRequestException(err.message);
    });

    if (body.password) {
      await this.authService.removeTokenUserId(id);
    }

    const res: ResponseUserDTO = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      createdAt: user.createdAt,
    };

    return res;
  }
}
