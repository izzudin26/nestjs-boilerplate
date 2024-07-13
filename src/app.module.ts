import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './databases/database.module';
import { AssetController } from './asset/asset.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule],
  controllers: [AppController, AssetController],
  providers: [AppService],
})
export class AppModule {}
