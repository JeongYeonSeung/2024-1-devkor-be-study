import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy as AccessStrategy } from './passport/accessToken.strategy';
import { JwtStrategy as RefreshStrategy } from './passport/refreshToken.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessStrategy, RefreshStrategy],
})
export class AuthModule {}
