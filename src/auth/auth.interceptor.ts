import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthInterceptor.name);

  constructor(private readonly usersService: UsersService) {
    console.log('auth.interceptor::constructor(): 1:', 1);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(`intercept(): request.email: ${request.email}`);

    if (!request.email) return;

    request.loginUser = this.usersService.findOneByEmail(request.email);

    return next.handle();
  }
}
