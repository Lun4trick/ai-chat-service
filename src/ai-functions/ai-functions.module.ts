import { Module } from '@nestjs/common';
import { AiFunctionsService } from './ai-functions.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [AiFunctionsService],
  providers: [AiFunctionsService],
})
export class AiFunctionsModule {}
