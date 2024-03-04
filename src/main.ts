import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 파라미터 변환 활성화
    // whitelist: true, // DTO에 정의되지 않은 속성 제거
    // forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있을 때 예외 발생
  }));
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
