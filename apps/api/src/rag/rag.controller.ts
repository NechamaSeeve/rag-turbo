import { Controller, Get, Query } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Get('query')
  async query(@Query('q') question: string) {
    const docs = [
      {
        pageContent: 'LangChain is a framework for building LLM applications.',
      },
      { pageContent: 'Ollama allows you to run LLMs locally.' },
    ];

    const answer = await this.ragService.answerFromDocs(question, docs);
    return { question, answer };
  }
}
