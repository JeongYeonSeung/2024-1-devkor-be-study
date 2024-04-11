import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { EmailService } from 'src/services/email.service';
import { EmailTokenEntity } from 'src/entities/email-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EmailTokenEntity])],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
