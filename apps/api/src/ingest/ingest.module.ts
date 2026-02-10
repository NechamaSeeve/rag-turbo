import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestController } from './ingest.controller';
import { EmbeddingFactory } from 'src/factories/embedding.factory';

@Module({
  controllers: [IngestController],
  providers: [IngestService, EmbeddingFactory],
  exports: [IngestService],
})
export class IngestModule {}
