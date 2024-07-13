import { Module } from '@nestjs/common';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'src/constant/env';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + 'entities' + '*{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
