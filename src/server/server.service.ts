import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Server, ServerDocument } from '@/server/schema/server.schema';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class ServerService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly configService: ConfigService,
  ) {}

  async getServer(serverId: string): Promise<ServerDocument> {
    const server = await this.serverModel.findOne({ serverId });
    if (!server) {
      return this.serverModel.create({
        serverId,
        prefix: this.configService.defaultPrefix,
        allowedChannels: [],
      });
    }

    return server;
  }

  async getServerPrefix(serverId: string): Promise<string> {
    const server = await this.getServer(serverId);
    return server.prefix ?? '!';
  }

  async setServerPrefix(serverId: string, prefix: string): Promise<string> {
    if (
      this.configService.adminPrefix.trim().toLowerCase() ===
      prefix.trim().toLowerCase()
    ) {
      throw new Error(`You can not use the \`${prefix}\` prefix.`);
    }

    const server = await this.getServer(serverId);
    const formattedPrefix = this.formatPrefix(prefix);
    server.prefix = formattedPrefix;
    await server.save();

    return formattedPrefix;
  }

  formatPrefix(prefix: string): string {
    if (prefix.length === 1) return prefix;
    return prefix + ' ';
  }
}
