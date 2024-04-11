import { IsNotEmpty } from 'class-validator';

export class PostLikeToggleDto {
  @IsNotEmpty()
  postId: string;
}
