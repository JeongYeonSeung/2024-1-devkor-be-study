import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity('like')
export class LikeEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'like_id' })
  likeId: number;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  post: PostEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserEntity;
}
