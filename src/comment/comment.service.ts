import { ReplyService } from './../reply/reply.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CommentResDto } from 'src/dtos/comment-reply-res.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly replyService: ReplyService,
  ) {}

  async createComment(postId: number, userId: number, content: string) {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!post) {
      throw new NotFoundException('게시글 정보를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    const comment = new CommentEntity();
    comment.user = user;
    comment.post = post;
    comment.content = content;
    comment.isDeleted = false;
    comment.createdDate = new Date().toISOString();

    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { commentId: commentId },
      relations: ['user'],
    });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException(
        '이미 댓글이 삭제되었거나, 댓글 정보를 찾을 수 없습니다.',
      );
    }

    if (comment.user.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    comment.isDeleted = true;
    comment.content = '삭제된 댓글입니다.';
    comment.user = null;
    comment.createdDate = null;
    await this.commentRepository.save(comment);
  }

  async getCommentListByPostId(postId: number): Promise<CommentResDto[]> {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글 정보를 찾을 수 없습니다.');
    }

    const commentList = await this.commentRepository.find({
      where: { post: { postId: postId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    const parsedCommentList = commentList
      ? commentList.map(async (comment) => {
          const replies = await this.replyService.getReplyListByCommentId(
            comment.commentId,
          );
          return {
            content: comment.isDeleted ? '삭제된 댓글입니다.' : comment.content,
            nickname: comment.isDeleted ? '' : comment.user.nickname,
            createdDate: comment.isDeleted ? '' : comment.createdDate,
            replies: replies,
          };
        })
      : [];

    return Promise.all(parsedCommentList);
  }
}
