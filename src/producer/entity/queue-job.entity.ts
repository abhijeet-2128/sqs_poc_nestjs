import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class QueueJob {
  @Prop({ unique: true })
  message_id: string;

  @Prop({ type: String })
  message: any;

  @Prop({ type: String })
  entity: any;

  @Prop({ type: String })
  queue: string;

  @Prop({ type: String })
  job_type: string;

  @Prop({ default: 0 })
  status: number;

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;

  @Prop({ type: Date, default: () => new Date() })
  updated_at: Date;

}

export const QueueJobSchema = SchemaFactory.createForClass(QueueJob);
