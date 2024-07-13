import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto, UpdateUser } from './user.dto';
import { DataSource } from 'typeorm';
import { User } from 'src/databases/entities';
import { AuthService } from 'src/auth/service.auth';

@Injectable()
export class UserService {
  constructor(
    private readonly datasource: DataSource,
    private readonly authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.datasource.manager.findOne(User, {
      where: { username: createUserDto.username.toLowerCase() },
    });

    if (checkUser) throw new Error('username telah terdaftar');

    const u = new User();
    u.fullname = createUserDto.fullname;
    u.username = createUserDto.username.toLowerCase();
    u.password = await this.authService.generatePassword(createUserDto.password);
    u.role = 2;

    await this.datasource.manager.save(User, u);

    return u;
  }

  async findAll() {
    return await this.datasource.manager.find(User, {
      where: { role: 2 },
    });
  }

  async findOne(username: string) {
    return await this.datasource.manager.findOne(User, {
      where: { username },
    });
  }

  async findOneById(id: number) {
    return await this.datasource.manager.findOne(User, {
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUser) {
    const u = await this.datasource.manager.findOne(User, {
      where: { id },
    });

    if (!u) throw new Error('Username tidak ditemukan');

    u.fullname = updateUserDto.fullname;
    if (updateUserDto.password)
      u.password = await this.authService.generatePassword(updateUserDto.password);

    await this.datasource.manager.save(User, u);
    return u;
  }

  async updatePassword(id: number, p: UpdatePasswordDto) {
    const u = await this.datasource.manager.findOne(User, {
      where: { id },
    });

    const isOldPasswordValid = await this.authService.verifyPassword(u.password, p.oldPassword);
    if (!isOldPasswordValid) throw new Error('Password lama salah');

    u.password = await this.authService.generatePassword(p.password);

    await this.datasource.manager.save(User, u);

    return u;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
