import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Socket } from 'socket.io';
import { openaiTools } from './openai.tool-schemas';
import {
  AiFunctionsService,
  toolNameType,
} from 'src/ai-functions/ai-functions.service';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly aiFunctionsService: AiFunctionsService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(
    messages: ChatCompletionMessageParam[],
    client: Socket,
  ): Promise<string | null> {
    const messageArray: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: process.env.OPEN_AI_PROMPT,
      },
      {
        role: 'system',
        content: `todays date is ${new Date().toDateString()}`,
      },
      ...messages,
    ];
    try {
      const response = await this.openai.chat.completions.create({
        max_completion_tokens: 200,
        model: 'gpt-4o-mini',
        tools: openaiTools,
        messages: messageArray,
      });

      if (response.choices[0].finish_reason === 'tool_calls') {
        const tool = response.choices[0].message.tool_calls[0];
        const toolName = tool.function.name as toolNameType;
        const toolArgs = JSON.parse(tool.function.arguments);
        console.log(tool);

        const toolToUse = this.aiFunctionsService.getAction(toolName);
        const result = toolToUse(toolArgs);

        const responsemessage = await this.openai.chat.completions.create({
          max_completion_tokens: 150,
          model: 'gpt-4o-mini',
          messages: [
            ...messageArray,
            response.choices[0].message,
            {
              role: 'tool',
              content: JSON.stringify({
                result,
              }),
              tool_call_id: tool.id,
            },
          ],
        });

        console.log(responsemessage);

        return responsemessage.choices[0].message.content;
      }

      const aiResponse = response.choices[0].message.content;

      console.log(aiResponse);

      return aiResponse;
    } catch (error) {
      console.error(error);
      client.emit('send-message', {
        role: 'system',
        content: 'Sorry, I am having trouble processing your request.',
      });
    }
  }
}
