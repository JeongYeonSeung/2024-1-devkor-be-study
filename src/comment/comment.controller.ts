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
  constructor(private readonly commentservice: CommentService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Req() req,
    @Body() body: CreateCommentDto,
  ) {
    const user = req?.user;
    await this.commentservice.createComment(postId, user.id, body.content);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req) {
    const user = req.user;
    await this.commentservice.deleteComment(Number(commentId), user.id);
  }
}
