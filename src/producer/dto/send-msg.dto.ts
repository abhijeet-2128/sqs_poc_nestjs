import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}

export class SendJobDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @IsNotEmpty()
  @IsString()
  jobType: string;

  @IsOptional()
  @IsString()
  messageGroupId: string;
}
