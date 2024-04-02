import { IsNotEmpty } from 'class-validator';
import { CommentResDto } from 'src/dtos/comment-reply-res.dto';

export class PostInfoResDto {
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  views: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  likes: number;

  @IsNotEmpty()
  likedUserList: string[];

  @IsNotEmpty()
  commentsAndReplies: CommentResDto[];
}
