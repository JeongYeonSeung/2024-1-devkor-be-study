import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('email_token')
export class EmailTokenEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'email_token_id' })
  emailTokenId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  token: string;

  @Column({ name: 'is_verified' })
  isVerified: boolean;

  @Column({ name: 'expired_time' })
  expiredTime: Date;
}
