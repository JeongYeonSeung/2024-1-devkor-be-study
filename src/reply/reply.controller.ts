import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access.guard';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('/:commentId')
  async createReply(
    @Param('commentId') commentId: string,
    @Req() req,
    @Body() body: CreateReplyDto,
  ) {
    const user = req.user;
    await this.replyService.createReply(
      Number(commentId),
      user.id,
      body.content,
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('/:replyId')
  async deleteReply(@Param('replyId') replyId: string, @Req() req) {
    const user = req.user;
    await this.replyService.deleteReply(Number(replyId), user.id);
  }
}
