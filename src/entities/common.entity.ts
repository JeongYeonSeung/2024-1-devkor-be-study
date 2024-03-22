import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity {
  // 생성일자를 적용해주는 컬럼
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // update 쿼리 날릴 때, 자동으로 수정일자를 넣어줌
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  // soft delete를 위한 컬럼
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
