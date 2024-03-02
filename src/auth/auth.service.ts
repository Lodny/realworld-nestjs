import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtService: JwtService;
  private readonly tokenStarter: string;
  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>("JWT_SECRET");
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN");
    this.jwtService = new JwtService({
      secret,
      signOptions: {expiresIn},
    });

    this.tokenStarter = this.configService.get<string>("JWT_TOKEN_STARTER");
    this.logger.log(`constructor: tokenStarter: ${this.tokenStarter}`)
  }

  createToken(payload: object) {
    return this.jwtService.sign(payload);
  }

  getToken(auth: string) {
    const token = this.getTokenString(auth);

    try {
      return this.jwtService.verify(token);
    } catch (e) {
      if (e instanceof TokenExpiredError)
        console.log('auth.service::checkToken(): TokenExpiredError');

      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
  }

  private getTokenString(auth: string) {
    if (!auth || !auth.startsWith(this.tokenStarter))
      throw new HttpException('token is invalid', HttpStatus.BAD_REQUEST);

    return auth.split(' ')[1];
  }

  hasToken = (auth: string) => auth && auth.startsWith(this.tokenStarter);
  hasNotToken = (auth: string) => !this.hasToken(auth);
}
