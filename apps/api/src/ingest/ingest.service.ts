import { Injectable, Logger } from '@nestjs/common';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ConfigService } from '@nestjs/config';
import { EmbeddingFactory } from 'src/factories/embedding.factory';

@Injectable()
export class IngestService {
  private vectorStore: Chroma;
  private logger = new Logger();
  constructor(
    private configService: ConfigService,
    private embeddingFactory: EmbeddingFactory,
  ) {
    // const model = this.configService.get<string>('OLLAMA_MODEL') || '';
    // const embeddings = new OllamaEmbeddings({
    //   model: 'llama3.2:3b',
    //   baseUrl: 'http://127.0.0.1:11434',
    // });
    const embeddings = this.embeddingFactory.getEmbedding('ollama');

    this.vectorStore = new Chroma(embeddings, {
      collectionName: 'rag-documents-new',
      url: 'http://localhost:8000',
    });
  }

  async ingestText(text: string) {
    try {
      this.logger.log('starting from ingest service!!');
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });

      const docs = await splitter.createDocuments([text]);
      this.logger.log(`Documents split: ${docs.length}`);
      this.logger.log('Sending to Ollama for embeddings...');

      await this.vectorStore.addDocuments(docs);
      this.logger.log('Documents added to Chroma');

      return { chunksStored: docs.length };
    } catch (err) {
      this.logger.error('Error ingesting document', err);
      throw err;
    }
  }

  getVectorStore() {
    return this.vectorStore;
  }
}
