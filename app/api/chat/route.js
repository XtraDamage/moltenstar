export async function POST(req) {
  try {
    const { 
      messages, 
      agentId, 
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions',
      modelId = 'x-ai/grok-4.6',
      apiKey
    } = await req.json();

    const finalApiKey = apiKey || process.env.OPENROUTER_API_KEY;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${finalApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoltenStar'
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: true
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Request failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
