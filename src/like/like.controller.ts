import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('/:postId')
  async createLike(@Param('postId') postId: string, @Req() req) {
    const user = req.user;
    await this.likeService.createLike(Number(postId), user.id);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('/:likeId')
  async deleteLike(@Param('likeId') likeId: string, @Req() req) {
    const user = req.user;
    await this.likeService.deleteLike(Number(likeId), user.id);
  }
}
