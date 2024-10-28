import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { DatabaseModule } from 'src/database/database.module';
import { AiFunctionsModule } from 'src/ai-functions/ai-functions.module';

@Module({
  imports: [DatabaseModule, AiFunctionsModule],
  exports: [OpenAIService],
  providers: [OpenAIService],
})
export class OpenaiModule {}
