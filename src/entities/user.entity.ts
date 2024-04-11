import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { PostEntity } from './post.entity';

@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'email', unique: true, nullable: false })
  email: string;

  @Column('varchar', { name: 'nickname', unique: true, nullable: false })
  nickname: string;

  @Column('varchar', { name: 'password', unique: false, nullable: false })
  password: string;

  @Column('varchar', { name: 'refresh_token', nullable: true })
  refreshToken: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
