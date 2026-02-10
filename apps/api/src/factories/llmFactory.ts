import { Injectable } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';

@Injectable()
export class LLMFactory {
  getLLM(modelName: string) {
    switch (modelName) {
      case 'ollama':
        return new Ollama({
          model: 'llama3.2:3b',
          baseUrl: 'http://127.0.0.1:11434',
        });

      default:
        throw new Error(`LLM model ${modelName} not supported`);
    }
  }
}
