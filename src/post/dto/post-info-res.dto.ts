import { IsNotEmpty } from 'class-validator';

export class ReplyResDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  createdDate: string | null;
}

export class CommentResDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  createdDate: string | null;

  @IsNotEmpty()
  replies: ReplyResDto[];
}

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

  likes: number;

  likedUserNicknames: string[];

  commentsAndReplies: CommentResDto[];
}
