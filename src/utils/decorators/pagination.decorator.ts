import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../types/pagination.type';

export const GetPagination = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const page = Number(req.query?.page) || 1;
    let limit = Number(req.query?.limit) || 10;
    if (limit > 50) {
      limit = 50;
    }
    return {
      page,
      limit,
    };
  },
);
