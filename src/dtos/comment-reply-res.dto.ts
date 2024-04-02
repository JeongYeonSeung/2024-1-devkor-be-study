import { IsNotEmpty } from 'class-validator';

export class ReplyResDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  createdDate: string;
}

export class CommentResDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  createdDate: string;

  @IsNotEmpty()
  replies: ReplyResDto[];
}
