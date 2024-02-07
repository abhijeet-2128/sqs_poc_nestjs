import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueueJob } from './entity/queue-job.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SQSClient, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import config from '../config/env.config';
import { MessageDto } from './dto/send-msg.dto';

@Injectable()
export class ProducerService {
  constructor(
    @InjectModel(QueueJob.name) private readonly queueJobModel: Model<QueueJob>,
  ) { }

  /**
   * Sends a message to an AWS SQS queue.
   *
   * @param message - The message content to be sent.
   * @param jobType - The type of job associated with the message.
   * @param messageGroupId - The message group ID (used for FIFO queues).
   * @returns An object containing the generated message ID.
   * @throws BadRequestException if an invalid queue type is configured.
   */
  async send(message: MessageDto, jobType: string, messageGroupId: string) {
    const { region, accessKeyId, secretAccessKey, isFifo, queueType, queueUrl } = config.awsSqs;

    if (!['standard', 'fifo'].includes(queueType)) {
      throw new BadRequestException('Invalid queue type');
    }

    let sqsMessageInput: SendMessageCommandInput = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        message,
        MessageAttributes: {
          job: {
            DataType: 'string',
            StringValue: jobType,
          },
        },
      }),
    };

    if (isFifo) {
      sqsMessageInput.MessageGroupId = messageGroupId;
    }

    const sqs = new SQSClient({ region, credentials: { accessKeyId, secretAccessKey } });
    const response: SendMessageCommandOutput = await sqs.send(new SendMessageCommand(sqsMessageInput));
    const messageId: string = response.MessageId;

    // queueJob entity
    const input: Partial<QueueJob> = {
      message_id: messageId,
      message: JSON.stringify(sqsMessageInput),
      entity: JSON.stringify(message),
      job_type: jobType,
      queue: config.awsSqs.queueName,
    };

    await this.queueJobModel.create(input);

    return { messageId };
  }
}
