import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly logger = new Logger(AuthGuard.name);

  // constructor(@Inject(Reflector) private readonly reflector: Reflector) {}
  constructor(private reflector: Reflector,
              private authService: AuthService) {
    console.error('auth.guard::constructor(): 1:', 1);
  }

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const hasSecuredDecorator = !!this.reflector.get<string[]>('secured', context.getHandler());
    this.logger.log(`canActivate(): hasSecuredDecorator: ${hasSecuredDecorator}`);

    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    if (hasSecuredDecorator && this.authService.hasNotToken(auth))
      throw new HttpException('no token', HttpStatus.BAD_REQUEST);

    if (this.authService.hasNotToken(auth))
      return true;

    const {email} = this.authService.getToken(auth);
    this.logger.log(`canActivate(): email: ${email}`);
    request.email = email;

    return true;
  }
}
