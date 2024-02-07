import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class ConsumerJob extends Document {
  @Prop({ type: String })
  message: string;

  @Prop({ default: 0 })
  status: number;

}

export const ConsumerJobSchema = SchemaFactory.createForClass(ConsumerJob);
