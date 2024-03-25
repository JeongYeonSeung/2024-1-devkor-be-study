import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class EmailTokenEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  emailTokenId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  token: string;

  @Column()
  isVerified: boolean;
}
