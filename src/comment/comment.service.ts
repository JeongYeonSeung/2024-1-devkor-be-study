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

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createComment(postId: string, userId: number, content: string) {
    const post = await this.postRepository.findOne({
      where: { postId: Number(postId) },
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
}
