import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('reply')
export class ReplyEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'reply_id' })
  replyId: number;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies)
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'commentId' })
  comment: CommentEntity;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'created_date', nullable: true })
  createdDate: string;
}
