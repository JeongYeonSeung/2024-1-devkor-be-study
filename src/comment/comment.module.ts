import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ReplyService } from 'src/reply/reply.service';
import { ReplyEntity } from 'src/entities/reply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      UserEntity,
      PostEntity,
      ReplyEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, ReplyService],
})
export class CommentModule {}
