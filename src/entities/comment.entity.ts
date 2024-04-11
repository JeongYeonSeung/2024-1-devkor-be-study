import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { ReplyEntity } from './reply.entity';

@Entity('comment')
export class CommentEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @Column('varchar', { name: 'content' })
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  post: PostEntity;

  @OneToMany(() => ReplyEntity, (reply) => reply.comment)
  replies: ReplyEntity[];

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'created_date', nullable: true })
  createdDate: string;
}
