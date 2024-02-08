import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/env.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
  .setTitle('SQS POC Producer Api')
  .setDescription('API for sending messages to the message queue')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);
  await app.listen(config.port);
}
bootstrap();