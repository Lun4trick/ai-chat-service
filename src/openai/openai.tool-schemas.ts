import { ChatCompletionTool } from 'openai/resources';

export const openaiTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getFreeDates',
      description: `Get the available after the specified dat from arguments. 
                    The function returns an array of dates that are not booked. 
                    The function takes two parameters: month and year. 
                    The function returns an array of dates that are not booked.
                    You should offer the cloesest available date at first.`,
      parameters: {
        type: 'object',
        properties: {
          requested_year: {
            type: 'string',
            description: 'The requested date in the format YYYY.',
          },
          requested_month: {
            type: 'string',
            description: 'The requested date in the format MM.',
          },
        },
        required: ['requested_year', 'requested_month'],
        additionalProperties: false,
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'setMemo',
      description: `Set a memo for the specified date.  
                    The function takes two parameters: date and memo.
                    Its used by you to note down important information from your conversation.
                    Most important informations, like recruiter's name, company name, contact, etc.
                    Make a memo allways at the end of your conversation, based on the information you get from the context.
                    The function returns a string that the memo is set or not.`,
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'The requested date in the format YYYY-MM-DD.',
          },
          memo: {
            type: 'string',
            description: 'The memo to set for the date.',
          },
        },
        required: ['date', 'memo'],
        additionalProperties: false,
      },
    },
  },
];
