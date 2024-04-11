import { CommentService } from './../comment/comment.service';
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
import { LikeEntity } from 'src/entities/like.entity';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageDto } from './dto/page.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ViewEntity)
    private readonly viewRepository: Repository<ViewEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    private readonly commentService: CommentService,
  ) {}

  async getPostList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    const { sortBy, name, take, skip } = pageOptionsDto;

    const queryBuilder = this.postRepository.createQueryBuilder('post');

    if (name) {
      queryBuilder.where('post.title LIKE :name', { name: `%${name}%` });
    }

    if (sortBy) {
      if (sortBy === 'VIEW') {
        queryBuilder.orderBy('post.viewCount', 'DESC');
      } else if (sortBy === 'LIKE') {
        queryBuilder.orderBy('post.likeCount', 'DESC');
      } else {
        queryBuilder.orderBy('post.createdAt', 'DESC');
      }
    }

    const [postList, total] = await queryBuilder
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const pageMeta = new PageMetaDto({ pageOptionsDto, total });
    const last_page = pageMeta.last_page;

    if (last_page >= pageMeta.page) {
      return new PageDto(postList, pageMeta);
    } else {
      throw new NotFoundException('존재하지 않는 페이지 입니다.');
    }
  }

  async createPost(userId: number, title: string, content: string) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    const post = new PostEntity();

    post.user = user;
    post.title = title;
    post.content = content;
    post.likeCount = 0;
    post.viewCount = 0;

    return await this.postRepository.save(post);
  }

  async getPostInfo(postId: number, userId: number): Promise<PostInfoResDto> {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
      relations: ['views'],
    });

    if (!post) {
      throw new NotFoundException(
        '게시글이 삭제되었거나 게시글 정보를 찾을 수 없습니다.',
      );
    }
    const postInfoRes = new PostInfoResDto();

    postInfoRes.createdAt = post.createdAt.toISOString();
    postInfoRes.title = post.title;
    postInfoRes.content = post.content;
    postInfoRes.views = post.views ? post.views.length : 0;

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    postInfoRes.nickname = user.nickname;

    const likeList = await this.likeRepository.find({
      where: { post: { postId: postId } },
      relations: ['user'],
    });
    const likedUserList = likeList.map((like) => like.user.nickname);
    postInfoRes.likes = likeList ? likeList.length : 0;
    postInfoRes.likedUserList = likedUserList ? likedUserList : [];

    postInfoRes.commentsAndReplies =
      await this.commentService.getCommentListByPostId(Number(postId));

    // viewRepository 추가하기
    await this.viewRepository.save({
      post: post,
      user: user,
    });

    post.viewCount += 1;
    await this.postRepository.save(post);
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

  async postLikeToggle(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { post: { postId: postId }, user: { userId: userId } },
    });

    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });

    if (like) {
      post.likeCount -= 1;
      await this.postRepository.save(post);
      await this.likeRepository.delete({ likeId: like.likeId });
    } else {
      post.likeCount += 1;
      await this.postRepository.save(post);
      await this.likeRepository.save({
        post: { postId: postId },
        user: { userId: userId },
      });
    }
  }
}
