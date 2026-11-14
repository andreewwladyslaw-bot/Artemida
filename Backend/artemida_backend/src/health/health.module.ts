import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import { PrismaModule } from '../prismaORM/prisma.module.js';
import { PrismaHealthIndicator } from '../prismaORM/prisma.health.js';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator]
})
export class HealthModule {}