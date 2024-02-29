import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>("JWT_SECRET");
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN");
    // console.log('users.controller::login(): secret:', secret);
    // console.log('users.controller::constructor(): expiresIn:', expiresIn);

    this.jwtService = new JwtService({
      secret,
      signOptions: {expiresIn},
    });
  }

  createToken(payload: object) {
    return this.jwtService.sign(payload);
  }

  checkToken(token: string) {
    // console.log('auth.service::checkToken(): token:', token);
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      if (e instanceof TokenExpiredError)
        console.log('auth.service::checkToken(): TokenExpiredError');

      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
  }
}
