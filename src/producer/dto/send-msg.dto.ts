import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({example:"Message1"})
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example:"This is a sample message for testing"})
  body: string;
}

export class SendJobDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MessageDto)
  @ApiProperty({ type: MessageDto })
  message: MessageDto;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example:"email"})
  jobType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({example:"general"})
  messageGroupId: string;
}
