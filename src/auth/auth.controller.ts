import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './service.auth';
import { UserService } from 'src/user/user.service';
import { SignInRequestDTO, SignInResponseDTO } from './auth.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RestResponse } from 'src/commons/restResponse';
import { Request, Response } from 'express';
import { Public } from './guard.auth';
import { ResponseUserDTO, UpdatePasswordDto, UpdateUser } from 'src/user/user.dto';
import { IPayloadUser } from './types.auth';
import { RestRequest } from 'src/commons/restRequest';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @ApiExtraModels(SignInRequestDTO)
  @ApiExtraModels(SignInResponseDTO)
  @RestResponse(SignInResponseDTO)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInRequestDTO,
  ): Promise<SignInResponseDTO> {
    const user = await this.userService.findOne(data.username);

    if (!user) throw new UnauthorizedException('Username tidak ditemukan');

    const isPasswordSame = await this.authService.verifyPassword(user.password, data.password);
    if (!isPasswordSame) throw new UnauthorizedException('Password salah');

    const token = await this.authService.generateToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user, token);
    await this.authService.saveRefreshToken(refreshToken);

    res.cookie('refresh_token', refreshToken);

    return {
      fullname: user.fullname,
      role: user.role,
      token,
    };
  }

  @Public()
  @ApiExtraModels(SignInResponseDTO)
  @RestResponse(SignInResponseDTO)
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDTO> {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('No Refresh Token Found');

    const verifyRefresh = await this.authService.GetSaveRefreshToken(refreshToken);
    if (!verifyRefresh) throw new UnauthorizedException('Invalid Refresh Token');

    const payload = await this.authService.verify(refreshToken);
    const user = await this.userService.findOneById(payload.id);
    if (!user) throw new UnauthorizedException('Invalid user');

    const jwtToken = await this.authService.generateToken(user);
    const newRefreshToken = await this.authService.generateRefreshToken(user, jwtToken);

    await this.authService.replaceRefreshToken(refreshToken, newRefreshToken);

    res.cookie('refresh_token', newRefreshToken);

    return {
      fullname: user.fullname,
      role: user.role,
      token: jwtToken,
    };
  }

  @Public()
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('No Refresh Token Found');

    const verifyRefresh = await this.authService.GetSaveRefreshToken(refreshToken);
    if (!verifyRefresh) throw new UnauthorizedException('Invalid Refresh Token');

    const payload = await this.authService.verify(refreshToken);
    const user = await this.userService.findOneById(payload.id);
    if (!user) throw new UnauthorizedException('Invalid user');

    await this.authService.removeRefreshToken(refreshToken);
    res.cookie('refresh_token', '');

    return 'User has logout';
  }

  @ApiExtraModels(UpdatePasswordDto)
  @RestRequest(UpdatePasswordDto)
  @RestResponse(null)
  @Put('update-password')
  async updateSomePassword(@Req() req, @Body() body: UpdatePasswordDto) {
    const user = req.user as IPayloadUser;
    await this.userService.updatePassword(user.id, body).catch((err: Error) => {
      throw new BadRequestException(err.message);
    });
    return 'OK';
  }

  @ApiExtraModels(UpdateUser)
  @RestRequest(UpdateUser)
  @RestResponse(null)
  @Put('update-user')
  async updateSomeUser(@Req() req, @Body() body: UpdateUser) {
    const user = req.user as IPayloadUser;
    await this.userService.update(user.id, body).catch((err: Error) => {
      throw new BadRequestException(err.message);
    });
    return 'OK';
  }

  @ApiExtraModels(ResponseUserDTO)
  @RestResponse(ResponseUserDTO)
  @Get()
  async getSomeUser(@Req() req): Promise<Partial<ResponseUserDTO>> {
    const user = req.user as IPayloadUser;
    const snapshot = await this.userService.findOneById(user.id);

    return {
      id: snapshot.id,
      fullname: snapshot.fullname,
      username: snapshot.username,
    };
  }
}
