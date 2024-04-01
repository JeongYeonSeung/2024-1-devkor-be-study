import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from 'src/entities/like.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createLike(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!post) {
      throw new NotFoundException('게시글 정보를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    const alreadyLike = await this.likeRepository.findOne({
      where: { user: user },
    });

    if (alreadyLike) {
      throw new BadRequestException('이미 좋아요를 누른 게시글입니다.');
    }

    const like = new LikeEntity();
    like.user = user;
    like.post = post;

    return await this.likeRepository.save(like);
  }

  async deleteLike(likeId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { likeId: likeId },
      relations: ['user'],
    });

    if (!like) {
      throw new NotFoundException('좋아요를 누른 기록이 없습니다.');
    }

    if (like.user.userId !== userId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    await this.likeRepository.remove(like);
  }
}
