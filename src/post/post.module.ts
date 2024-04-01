import { UserEntity } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostEntity } from 'src/entities/post.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { ViewEntity } from 'src/entities/view.entity';
import { ReplyEntity } from 'src/entities/reply.entity';
import { LikeEntity } from 'src/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
      CommentEntity,
      ReplyEntity,
      LikeEntity,
      ViewEntity,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
