export const parseSSEResponse = async (
  response: Response,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  let accumulatedResponse = '';
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content;
          if (content) {
            accumulatedResponse += content;
            onChunk?.(content);
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e);
        }
      }
    }
  }

  return accumulatedResponse;
};