import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('view')
export class ViewEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'view_id' })
  viewId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.views)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  post: PostEntity;
}
