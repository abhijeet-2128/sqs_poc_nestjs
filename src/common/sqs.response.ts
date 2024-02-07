import { HTTP } from './code.responses';

/**
 * Module providing constants related to AWS SQS (Simple Queue Service) messages and responses.
 * @module SQSConstants
 */

export const SQS_MSG = {
    ERROR: `Failed to send job, message already exists`,
    SUCCESS: `Job sent successfully`,
    NO_MESSAGES_IN_QUEUE: 'No messages in the queue',
    ERROR_CONSUMING_MESSAGES: 'Error consuming messages',
    DELETED_MESSAGE_FROM_QUEUE: 'Deleted message from the queue',
    QUEUE_EMPTY_MESSAGE: 'Queue is empty. No further processing'
}

export const SQS_RESPONSE = {
    SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: SQS_MSG.SUCCESS,
    },
    ERROR: {
        httpCode: HTTP.MSG_ALREADY_EXISTS,
        statusCode: HTTP.MSG_ALREADY_EXISTS,
        message: SQS_MSG.ERROR,
    }
};