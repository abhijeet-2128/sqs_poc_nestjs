import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-sqs-mongodb',
  },
  awsSqs: {
    region: process.env.SQS_REGION || 'eu-north-1',
    accessKeyId: process.env.SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
    queueName: process.env.SQS_QUEUE_NAME || 'test_queue',
    isFifo: process.env.SQS_IS_FIFO === 'true' || false,
    queueType: process.env.SQS_QUEUE_TYPE || 'standard',
    queueUrl: process.env.SQS_QUEUE_URL || 'https://sqs.eu-north-1.amazonaws.com/your_account_id/test_queue',
    dlqUrl: process.env.SQS_DLQ_URL || 'https://sqs.eu-north-1.amazonaws.com/your_account_id/StandardDeadLetterQueue',
  },
};
