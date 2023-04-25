import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): any => {
  const endPoint = 'docs';
  const options = new DocumentBuilder()
    .setTitle('VIVI-BE Swagger Docs')
    .addServer('http://localhost:8081')
    .setDescription('desc')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const documnet = SwaggerModule.createDocument(app, options, { ignoreGlobalPrefix: true });
  SwaggerModule.setup(endPoint, app, documnet);
};
