import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const openApiFilePath = resolve(__dirname, '../openapi.json');

  const openApiFileContent = fs.readFileSync(openApiFilePath, 'utf-8');

  const openApiSpec = JSON.parse(openApiFileContent);

  const options = new DocumentBuilder()
    .setTitle('Clipspace API docs')
    .setVersion('1.0')
    .addSecurity('accessToken', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    })
    .addSecurity('refreshToken', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    })

    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { spec: openApiSpec },
  });

  await app.listen(3000);
  console.log('Docs available on : http://localhost:3000/docs');
}
bootstrap();
