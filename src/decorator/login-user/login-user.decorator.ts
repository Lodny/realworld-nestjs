import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const loginUser = ctx.switchToHttp().getRequest().loginUser;

  return data ? loginUser?.[data] : loginUser;
});
