export class MessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
