import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { OpenaiModule } from './openai/openai.module';
import { AiFunctionsModule } from './ai-functions/ai-functions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    OpenaiModule,
    AiFunctionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
