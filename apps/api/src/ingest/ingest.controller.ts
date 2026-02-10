import { Controller, Post, Body } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post()
  async ingest(@Body('text') text: string) {
    if (!text || text.trim() === '') {
      return { error: 'No text provided' };
    }
    const result = await this.ingestService.ingestText(text);
    return result;
  }
}
