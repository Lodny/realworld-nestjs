import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const Token = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().token;
});
