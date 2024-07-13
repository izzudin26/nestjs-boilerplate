import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './interceptors/error.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import swaggerSchemas from './swagger/schemas';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Swagger
   */
  if (process.env.NODE_ENV == 'dev') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Documentation of API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: swaggerSchemas,
    });
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(3000);
}
bootstrap();
