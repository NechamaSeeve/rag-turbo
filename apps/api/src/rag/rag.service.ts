/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';

interface Document {
  pageContent: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class RagService {
  private client: Ollama;
  private model: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Ollama();
    this.model = this.configService.get<string>('OLLAMA_MODEL') || '';
  }

  async answerFromDocs(query: string, docs: Document[]): Promise<string> {
    z.string().min(1).parse(query);
    z.array(
      z.object({
        pageContent: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      }),
    ).parse(docs);

    const combinedDocs = docs.map((d) => d.pageContent).join('\n');

    const result = await this.client.generate({
      model: this.model,
      prompt: `Question: ${query}\nContext: ${combinedDocs}`,
    });

    return result.response;
  }
}
