import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JWTPayload } from 'src/auth/auth.service';
import { CurrentUser, JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { CommentService } from '../comment.service';
import { CommentCreateInput, CommentCreateOutput } from '../dto/comment-create.dto';
import { Comment } from '../models/comment.model';

@Resolver(Comment)
export class CommentMutationsResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentCreateOutput)
  async commentCreate(
    @CurrentUser() user: JWTPayload,
    @Args('input') input: CommentCreateInput,
  ) {
    return this.commentService.commentCreate(user, input);
  }

//   @UseGuards(JwtAuthGuard)
//   @Mutation(() => ArticleUpdateOutput)
//   async articleUpdate(
//     @Args({ name: 'articleId', type: () => ID }) articleId: Article['id'],
//     @Args('input') input: ArticleUpdateInput,
//   ) {
//     return this.artcicleService.articleUpdate(articleId, input);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Mutation(() => ArticleDeleteOutput)
//   async articleDelete(
//     @Args({ name: 'articleId', type: () => ID }) articleId: Article['id'],
//   ) {
//     return this.artcicleService.articleDelete(articleId);
//   }
}
