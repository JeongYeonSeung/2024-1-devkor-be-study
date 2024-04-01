import { ViewEntity } from './../entities/view.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      ],
    });

    if (!post) {
      throw new NotFoundException('게시글 정보를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    // viewRepository 추가하기
    await this.viewRepository.save({
      post: post,
      userId: userId,
    });

    // 시간 너무 오래걸릴거 같은데...최적화 필요.
    const postInfoRes = new PostInfoResDto();
    postInfoRes.nickname = user.nickname;
    postInfoRes.createdAt = post.createdAt.toISOString();
    postInfoRes.views = post.views ? post.views.length : 0;
    postInfoRes.title = post.title;
    postInfoRes.likes = post.likes ? post.likes.length : 0;
    postInfoRes.likedUserNicknames = post.likes
      ? post.likes.map((like) => like.user.nickname)
      : [];
    postInfoRes.commentsAndReplies = post.comments
      ? post.comments.map((comment) => ({
          content: comment.content,
          nickname: comment.user ? comment.user.nickname : '',
          createdDate: comment.createdDate,
          replies: comment.replies
            ? comment.replies.map((reply) => ({
                content: reply.content,
                nickname: reply.user ? reply.user.nickname : '',
                createdDate: reply.createdDate,
              }))
            : [],
        }))
      : [];

    return postInfoRes;
  }
}
