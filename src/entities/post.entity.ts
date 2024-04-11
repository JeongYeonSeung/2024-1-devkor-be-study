import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';
import { ViewEntity } from './view.entity';

@Entity('post')
export class PostEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column('varchar', { name: 'title', nullable: false })
  title: string;

  @Column('varchar', { name: 'content', nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @OneToMany(() => ViewEntity, (view) => view.post)
  views: ViewEntity[];

  @Column()
  likeCount: number;

  @Column()
  viewCount: number;
}
