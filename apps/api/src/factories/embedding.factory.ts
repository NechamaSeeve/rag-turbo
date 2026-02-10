import { Injectable } from '@nestjs/common';
import { OllamaEmbeddings } from '@langchain/ollama';

@Injectable()
export class EmbeddingFactory {
  getEmbedding(modelName: string) {
    switch (modelName) {
      case 'ollama':
        return new OllamaEmbeddings({
          model: 'llama3.2:3b',
          baseUrl: 'http://127.0.0.1:11434',
        });

      default:
        throw new Error(`Embedding model ${modelName} not supported`);
    }
  }
}
