import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { ConfigModule } from '@nestjs/config';
import { IngestModule } from 'src/ingest/ingest.module';
import { LLMFactory } from 'src/factories/llmFactory';

@Module({
  imports: [IngestModule, ConfigModule],
  providers: [RagService, LLMFactory],
  controllers: [RagController],
})
export class RagModule {}
