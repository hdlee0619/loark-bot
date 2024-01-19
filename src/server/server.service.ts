import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Channel,
  Guild,
  GuildMember,
  Message,
  PermissionsBitField,
} from 'discord.js';

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

  async administratorGuard(
    message: Message,
    requester: GuildMember,
  ): Promise<boolean> {
    // TEST: 관리자 아닌 경우 테스트 필요
    if (!requester.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await message.reply({ content: '관리자가 아닙니다.' });

      return false;
    } else {
      return true;
    }
  }

  async hasAdminRoleGuard(
    message: Message,
    guild: Guild,
    requesterId: string,
  ): Promise<boolean> {
    const requester = guild.members.resolve(requesterId);
    const server = await this.getServer(guild.id);

    try {
      return await this.administratorGuard(message, requester);
    } catch (error) {
      // TEST: requester.roles.cache.has(server.adminRole)에 대한 테스트 필요
      if (!requester.roles.cache.has(server.adminRole)) {
        return false;
      }
    }
  }

  async isChannelAllowed(
    serverId: string,
    channelId: string,
  ): Promise<boolean> {
    const server = await this.getServer(serverId);
    return !!(
      !server.allowedChannels ||
      server.allowedChannels?.length === 0 ||
      server.allowedChannels.includes(channelId)
    );
  }

  async setChannel(
    message: Message,
    guild: Guild,
    requesterId: string,
    channel: Channel,
  ): Promise<ServerDocument> {
    await this.hasAdminRoleGuard(message, guild, requesterId);
    const server = await this.getServer(guild.id);

    if (!server.allowedChannels) {
      server.allowedChannels = [channel.id];
      await server.save();
    } else {
      if (!server.allowedChannels.includes(channel.id)) {
        server.allowedChannels.push(channel.id);
        await server.save();
      }
    }

    return server;
  }

  async unsetChannel(
    message: Message,
    guild: Guild,
    requesterId: string,
    channel: Channel,
  ) {
    await this.hasAdminRoleGuard(message, guild, requesterId);
    const server = await this.getServer(guild.id);

    if (!server.allowedChannels) {
      server.allowedChannels = [];
      await server.save();
    } else {
      if (server.allowedChannels.includes(channel.id)) {
        server.allowedChannels = server.allowedChannels.filter(
          (chanId) => chanId !== channel.id,
        );
        await server.save();
      }
    }

    return server;
  }

  async setAdminRole(
    message: Message,
    guild: Guild,
    requesterId: string,
    role: string,
  ): Promise<void> {
    const requester = guild.members.resolve(requesterId);
    await this.administratorGuard(message, requester);
    const server = await this.getServer(guild.id);

    server.adminRole = role;
    await server.save();
  }
}
