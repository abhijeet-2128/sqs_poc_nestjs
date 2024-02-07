import { Injectable } from '@nestjs/common';
import { ConsumerJob } from './entity/consumer-job.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteMessageCommand, GetQueueAttributesCommand, Message, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import config from '../config/env.config';

@Injectable()
export class ConsumerService {
  private readonly sqsClient: SQSClient;

  constructor(
    @InjectModel(ConsumerJob.name) private readonly consumerJobModel: Model<ConsumerJob>,
  ) {
    this.sqsClient = new SQSClient({
      region: config.awsSqs.region,
      credentials: {
        accessKeyId: config.awsSqs.accessKeyId,
        secretAccessKey: config.awsSqs.secretAccessKey,
      },
    });
  }

  /**
   * Handles a single SQS message.
   *
   * @param message - The SQS message to be handled.
   * @returns A Promise resolving to void.
   */
  @SqsMessageHandler(config.awsSqs.queueName)
  async handleMessage(message: Message): Promise<void> {
    if (await this.isQueueEmpty()) {
      return;
    }
    await this.saveConsumedMessage(message.Body);
    await this.deleteMessageFromQueue(message.ReceiptHandle);
    await this.updateStatusAfterDeletion(message.Body);
  }

  /**
   * Receives and processes a batch of messages from the AWS SQS queue.
   *
   * @param batchSize - The number of messages to receive and process in a batch.
   * @returns A Promise resolving to an array of consumed messages.
   * @throws An error if there's an issue during message processing.
   */
  async receiveAndProcessMessages(batchSize: number): Promise<Message[]> {
    try {
      const messages: Message[] = await this.receiveMessagesFromSQS(batchSize);
      for (const message of messages) {
        await this.handleMessage(message);
      }
      return messages;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Checks if the AWS SQS queue is empty.
   *
   * @returns A Promise resolving to a boolean indicating whether the queue is empty.
   */
  private async isQueueEmpty(): Promise<boolean> {
    const result = await this.sqsClient.send(new GetQueueAttributesCommand({
      QueueUrl: config.awsSqs.queueUrl,
      AttributeNames: ['ApproximateNumberOfMessages'],
    }));
    const numberOfMessages = result.Attributes?.ApproximateNumberOfMessages || 0;
    return numberOfMessages === 0;
  }

  /**
   * Saves the consumed message to the MongoDB collection.
   *
   * @param messageBody - The body of the consumed message.
   * @returns A Promise resolving to void.
   */
  private async saveConsumedMessage(messageBody: string): Promise<void> {
    const consumerJob = new this.consumerJobModel({ message: messageBody });
    await consumerJob.save();
  }

  /**
   * Deletes a message from the AWS SQS queue.
   *
   * @param receiptHandle - The receipt handle of the message to be deleted.
   * @returns A Promise resolving to void.
   */
  private async deleteMessageFromQueue(receiptHandle: string): Promise<void> {
    const deleteCommand = new DeleteMessageCommand({
      ReceiptHandle: receiptHandle,
      QueueUrl: config.awsSqs.queueUrl,
    });
    await this.sqsClient.send(deleteCommand);
  }

  /**
   * Receives messages from the AWS SQS queue.
   *
   * @param batchSize - The number of messages to receive in a batch.
   * @returns A Promise resolving to an array of received messages.
   */
  private async receiveMessagesFromSQS(batchSize: number): Promise<Message[]> {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: config.awsSqs.queueUrl,
      MaxNumberOfMessages: batchSize,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 10,
    });
    const response = await this.sqsClient.send(receiveCommand);
    return response.Messages ?? [];
  }

  private async updateStatusAfterDeletion(messageBody: string): Promise<void> {
    const message = await this.consumerJobModel.findOne({ message: messageBody });

    // Update the status to 1
    if (message) {
      message.status = 1;
      await message.save();
    }
  }
}
