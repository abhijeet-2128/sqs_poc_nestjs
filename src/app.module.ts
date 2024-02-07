import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/env.config'

@Module({
  imports: [
    ProducerModule,
    ConsumerModule,
    MongooseModule.forRoot(config.mongodb.uri),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }