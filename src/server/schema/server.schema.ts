import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServerDocument = HydratedDocument<Server>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Server {
  @Prop({
    required: true,
  })
  serverId: string;

  @Prop()
  prefix: string;

  @Prop()
  adminRole?: string;

  @Prop()
  allowedChannels?: string[];
}

export const ServerSchema = SchemaFactory.createForClass(Server);
