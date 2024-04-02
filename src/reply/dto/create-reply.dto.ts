import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  commentId: string;

  @IsNotEmpty()
  content: string;
}
