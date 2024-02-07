import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumerJob, ConsumerJobSchema } from './entity/consumer-job.entity';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import config from '../config/env.config'

@Module({
  imports: [
    SqsModule.register({
      producers: [],
      consumers: [
        {
          name: config.awsSqs.queueName,
          queueUrl: config.awsSqs.queueUrl,
          region: config.awsSqs.region,
        },
      ],
    }),
    MongooseModule.forFeature([{ name: ConsumerJob.name, schema: ConsumerJobSchema }]),
    ConfigModule
  ],
  providers: [ConsumerService]
})
export class ConsumerModule { }
