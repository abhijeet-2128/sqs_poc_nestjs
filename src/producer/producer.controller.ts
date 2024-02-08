import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { SendJobDto } from './dto/send-msg.dto';
import { SQS_RESPONSE } from 'src/common/sqs.response';
import { ApiBadRequestResponse, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) { }

  /**
   * @param sendJobDto -The data transfer object (DTO) containing message details.
   * @returns response object indication success or error
   * @description This method processes incoming messages by extracting information
   * from the provided DTO and using the ProducerService to send the message to a message queue.
   */
  @Post('sendMessage')
  @ApiBody({ type: SendJobDto }) 
  @ApiResponse({ status: 200, description: 'Message sent successfully.' })
  @ApiBadRequestResponse({ description: 'Error sending message.' })
  async sendMessage(@Body(ValidationPipe) sendJobDto: SendJobDto) {
    try {
      const { message, jobType, messageGroupId } = sendJobDto;
      const result = await this.producerService.send(message, jobType, messageGroupId);
      return { ...SQS_RESPONSE.SUCCESS, messageId: result.messageId };
    } catch (error) {
      return SQS_RESPONSE.ERROR;
    }
  }
}
