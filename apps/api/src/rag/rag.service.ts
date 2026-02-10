import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from '@langchain/ollama';
import { IngestService } from 'src/ingest/ingest.service';
import { LLMFactory } from 'src/factories/llmFactory';

@Injectable()
export class RagService {
  private model: Ollama;
  private logger = new Logger();

  constructor(
    private ingestService: IngestService,
    private configService: ConfigService,
    private llmFactory: LLMFactory,
  ) {
    // const modelName =
    //   this.configService.get<string>('OLLAMA_MODEL') || '';

    // this.model = new Ollama({
    //   model: 'llama3.2:3b',
    //   baseUrl: 'http://127.0.0.1:11434',
    // });
    this.model = this.llmFactory.getLLM('ollama');
  }

  async ask(question: string) {
    const vectorStore = this.ingestService.getVectorStore();
    const result = await vectorStore.similaritySearch(question, 3);
    console.log('Chroma found chunks:', result.length);
    this.logger.log('Chroma is working!');

    if (result.length === 0) return { answer: 'I do not know' };

    const context = result.map((r) => r.pageContent).join('\n');

    const prompt = `You are a helpful assistant. Use the following pieces of retrieved context to answer the question if the answer is not found in the context say "i don't know" That is it!. 
    
Context:
${context}

Question: ${question}
Answer:`;

    const response = await this.model.invoke(prompt);
    this.logger.log(`response: ${response}`);
    const finalAnswer =
      typeof response === 'string' ? response : String(response);

    return { answer: finalAnswer };
  }
}
