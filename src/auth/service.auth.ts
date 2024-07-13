import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constant/env';
import { IPayloadRefreshToken, IPayloadUser } from './types.auth';
import { HASH_SALT } from 'src/constant/env';
import * as bcrypt from 'bcrypt';
import { Token, User } from 'src/databases/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly datasource: DataSource,
  ) {}

  async verify(token: string): Promise<IPayloadUser> {
    const payload = await this.jwtService.verifyAsync<IPayloadUser>(token, { secret: JWT_SECRET });
    return payload;
  }

  async decode(authorization: string): Promise<IPayloadUser> {
    const token = authorization.split(' ').at(-1);
    return this.verify(token);
  }

  async generatePassword(plainText: string) {
    return await bcrypt.hash(plainText, HASH_SALT);
  }

  async verifyPassword(hashPassword: string, plainText: string) {
    return await bcrypt.compare(plainText, hashPassword);
  }

  async generateToken(user: User) {
    const payload: IPayloadUser = {
      id: user.id,
      fullname: user.fullname,
      role: user.role,
    };

    return this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: '5m' });
  }

  async generateRefreshToken(user: User, token: string) {
    const payload: IPayloadRefreshToken = {
      id: user.id,
      fullname: user.fullname,
      role: user.role,
      token,
    };

    return this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: '2d' });
  }

  /**
   * Database
   */
  async saveRefreshToken(refreshToken: string) {
    const t = new Token();
    t.refreshToken = refreshToken;

    await this.datasource.manager.save(Token, t);
    return t;
  }

  async replaceRefreshToken(oldRefreshToken: string, newRefreshToken: string) {
    const t = await this.datasource.manager.findOne(Token, {
      where: { refreshToken: oldRefreshToken },
    });

    t.refreshToken = newRefreshToken;

    await this.datasource.manager.save(Token, t);
  }

  async GetSaveRefreshToken(refreshToken: string) {
    return await this.datasource.manager.findOne(Token, {
      where: { refreshToken },
    });
  }

  async removeRefreshToken(refreshToken: string) {
    const t = await this.datasource.manager.findOne(Token, {
      where: { refreshToken: refreshToken },
    });

    await this.datasource.manager.remove(t);
  }

  async removeTokenUserId(userId: number) {
    await this.datasource.manager.delete(Token, { userId });
  }
}
