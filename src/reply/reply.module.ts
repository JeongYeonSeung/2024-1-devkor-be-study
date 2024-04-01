import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ReplyEntity } from 'src/entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, ReplyEntity])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
