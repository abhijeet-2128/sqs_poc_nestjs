import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { QueueJob, QueueJobSchema } from './entity/queue-job.entity';
import { SqsModule } from '@ssut/nestjs-sqs';
import config from '../config/env.config'

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: config.awsSqs.queueName,
          queueUrl: config.awsSqs.queueUrl,
          region: config.awsSqs.region,
        },
      ],
    }),
    MongooseModule.forFeature([{ name: QueueJob.name, schema: QueueJobSchema }]),
    ConfigModule,
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule { }
