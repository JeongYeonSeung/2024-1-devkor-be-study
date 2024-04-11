import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { ReplyEntity } from 'src/entities/reply.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ReplyResDto } from 'src/dtos/comment-reply-res.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly replyRepository: Repository<ReplyEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createReply(commentId: number, userId: number, content: string) {
    const comment = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });
    if (!comment) {
      throw new NotFoundException('댓글 정보를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    const reply = new ReplyEntity();
    reply.comment = comment;
    reply.user = user;
    reply.content = content;
    reply.isDeleted = false;
    reply.createdDate = new Date().toISOString();

    return await this.replyRepository.save(reply);
  }

  async deleteReply(replyId: number, userId: number) {
    const reply = await this.replyRepository.findOne({
      where: { replyId: replyId },
      relations: ['user'],
    });

    if (!reply || reply.isDeleted) {
      throw new NotFoundException(
        '이미 답글이 삭제되었거나, 답글 정보를 찾을 수 없습니다.',
      );
    }

    if (reply.user.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    reply.isDeleted = true;
    reply.content = '삭제된 답글입니다.';
    reply.user = null;
    reply.createdDate = null;
    await this.replyRepository.save(reply);
  }

  async getReplyListByCommentId(commentId: number): Promise<ReplyResDto[]> {
    const comment = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글 정보를 찾을 수 없습니다.');
    }

    const replyList = await this.replyRepository.find({
      where: { comment: { commentId: commentId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    const parsedReplyList = replyList
      ? replyList.map(async (reply) => {
          return {
            content: reply.isDeleted ? '삭제된 답글입니다.' : reply.content,
            nickname: reply.isDeleted ? '' : reply.user.nickname,
            createdDate: reply.isDeleted ? '' : reply.createdDate,
          };
        })
      : [];

    return Promise.all(parsedReplyList);
  }
}
