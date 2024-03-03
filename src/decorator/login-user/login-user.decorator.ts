import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator(async (data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.email)
    return null;

  const loginUser = await request.loginUser;
  loginUser.token = request.token;
  // console.log('login-user.decorator::(): loginUser:', loginUser);

  return data ? loginUser?.[data] : loginUser;
});
