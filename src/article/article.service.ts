import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTPayload } from 'src/auth/auth.service';
import { Comment } from 'src/comment/models/comment.model';
import {
  PaginationArgs,
  SortDirection,
} from 'src/pagination/dto/pagination.dto';
import { User } from 'src/user/models/user.model';
import { Repository } from 'typeorm';
// import { ArticleCommentsPagination } from './dto/article-comments-pagination.dto';
import {
  ArticleCreateOutput,
  ArticleCreateInput,
} from './dto/article-create.dto';
import { ArticleDeleteOutput } from './dto/article-delete.dto';
import {
  ArticleUpdateInput,
  ArticleUpdateOutput,
} from './dto/article-update.dto';
import {
  ArticlesPagination,
  ArticlesPaginationArgs,
} from './dto/articles-pagination.dto';
import { Article } from './models/article.model';
import {ArticleCommentsPagination} from "./dto/article-comments-pagination.dto";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async articleCreate(
    user: JWTPayload,
    input: ArticleCreateInput,
  ): Promise<ArticleCreateOutput> {
    const article = this.articleRepository.create(input);
    article.author = new User();
    article.author.id = user.id;
    await article.save();
    return { article };
  }

  /**
   *
   * @param articleId Id (en bd) de l'article qu'on veut mettre à jour
   * @param input Article (au niveau du process) mit à jour
   * @returns Article (en bd) mit à jour
   */
  async articleUpdate(
    articleId: Article['id'],
    input: ArticleUpdateInput,
  ): Promise<ArticleUpdateOutput> {
    const article = await this.articleRepository.findOneOrFail(articleId);
    article.title = input.title;
    article.description = input.description;
    article.image = input.image;
    await article.save();
    return { article };
  }

  async articleDelete(articleId: Article['id']): Promise<ArticleDeleteOutput> {
    const article = await this.articleRepository.findOneOrFail(articleId);
    await article.remove();
    return { articleId };
  }

  // async articlesList(): Promise<Article[]> {
  //   return this.articleRepository.find()
  // }

  async articlesPagination(
    args: ArticlesPaginationArgs,
  ): Promise<ArticlesPagination> {
    const qb = this.articleRepository.createQueryBuilder('article');
    qb.take(args.take);
    qb.skip(args.skip);
    if (args.sortBy) {
      if (args.sortBy.createdAt !== null) {
        qb.addOrderBy(
          'article.createdAt',
          args.sortBy.createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      }
      if (args.sortBy.title !== null) {
        qb.addOrderBy(
          'article.title',
          args.sortBy.title === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      }
    }
    const [nodes, totalCount] = await qb.getManyAndCount();

    // const [nodes, totalCount] = await this.articleRepository.findAndCount({
    //   skip: args.skip,
    //   take: args.take,
    //   order: {
    //     createdAt:
    //       args.sortBy?.createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
    //   },
    // });

    return { nodes, totalCount };
  }

   async articleCommentsPagination(
     articleId: Article['id'],
     args: PaginationArgs,
   ): Promise<ArticleCommentsPagination> {
     const [nodes, totalCount] = await this.commentRepository.findAndCount({
       skip: args.skip,
       take: args.take,
       where: {
         article: { id: articleId }
       },
       order: {
         createdAt:
           args.sortBy?.createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
       },
     });
     return { nodes, totalCount };
   }

  async getById(articleId: Article['id']): Promise<Article> {
    return this.articleRepository.findOneOrFail(articleId);
  }
}
