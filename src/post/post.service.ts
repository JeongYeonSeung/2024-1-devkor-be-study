import { ViewEntity } from './../entities/view.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PostInfoResDto } from './dto/post-info-res.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ViewEntity)
    private readonly viewRepository: Repository<ViewEntity>,
  ) {}

  async createPost(userId: number, title: string, content: string) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    const post = new PostEntity();

    post.user = user;
    post.title = title;
    post.content = content;

    return await this.postRepository.save(post);
  }

  async getPostInfo(postId: string, userId: number): Promise<PostInfoResDto> {
    const post = await this.postRepository.findOne({
      where: { postId: Number(postId) },
      relations: [
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user',
        'likes',
        'likes.user',
        'views',
        'views.user',
      ],
    });

    if (!post) {
      throw new NotFoundException(
        '게시글이 삭제되었거나 게시글 정보를 찾을 수 없습니다.',
      );
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    // 맛있는 스파게티... 추후 수정하겠습니다...
    const postInfoRes = new PostInfoResDto();

    postInfoRes.nickname = user.nickname;
    postInfoRes.createdAt = post.createdAt.toISOString();
    postInfoRes.views = post.views
      ? post.views.filter((view) => view.user && view.user.deletedAt == null)
          .length
      : 0;
    postInfoRes.title = post.title;
    postInfoRes.likes = post.likes
      ? post.likes.filter((like) => like.user && like.user.deletedAt == null)
          .length
      : 0;
    postInfoRes.likedUserNicknames = post.likes
      ? post.likes
          .filter((like) => like.user && like.user.deletedAt == null)
          .map((like) => like.user.nickname)
      : [];

    postInfoRes.commentsAndReplies = post.comments
      ? post.comments
          .filter((comment) => comment.user && comment.user.deletedAt == null) // 삭제되지 않은 user의 comments만 포함
          .map((comment) => ({
            content: comment.content,
            nickname: comment.user ? comment.user.nickname : '',
            createdDate: comment.createdDate,
            replies: comment.replies
              ? comment.replies
                  .filter((reply) => reply.user && reply.user.deletedAt == null) // 삭제되지 않은 user의 replies만 포함
                  .map((reply) => ({
                    content: reply.content,
                    nickname: reply.user ? reply.user.nickname : '',
                    createdDate: reply.createdDate,
                  }))
              : [],
          }))
      : [];
    // viewRepository 추가하기
    await this.viewRepository.save({
      post: post,
      user: user,
    });

    return postInfoRes;
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('게시글 정보를 찾을 수 없습니다.');
    }
    if (post.user.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    await this.postRepository.softDelete(postId);
  }
}
