import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createComment(@Req() req, @Body() body: CreateCommentDto) {
    const user = req?.user;
    await this.commentService.createComment(
      Number(body.postId),
      user.id,
      body.content,
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req) {
    const user = req.user;
    await this.commentService.deleteComment(Number(commentId), user.id);
  }
}
