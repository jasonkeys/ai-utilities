import {Configuration, OpenAIApi } from 'openai';
import { stripHtml } from 'string-strip-html';

export async function handler (event, context) {
    console.debug(`openai-chat - event: ${JSON.stringify(event)}`);
    
    const requestBody = JSON.parse(event.body);
    console.debug(`openai-chat - requestData: ${JSON.stringify(requestBody)}`);

    const apiKey = process.env.OPENAI_API_KEY;
    const prompt = requestBody.prompt;
    const role = requestBody.role;
    const model = requestBody.model || "gpt-3.5-turbo";
    const maxTokens = requestBody.max_tokens || 500;
    const temperature = requestBody.temperature || 0.5;
    
    try {
      const configuration = new Configuration({
        apiKey: apiKey
      });

      let options = {
          model: model,
          messages: [{role: 'system', content: role ?? 'You are a chatbot utility function. Please respond to the best of your abilities to my query. It is OK to not have the answers. Tell me when you do not know but try your best. Thank you.' },
              {role: 'user', content: prompt}],
          temperature: temperature,
          max_tokens: maxTokens,
      };
      const openai = new OpenAIApi(configuration);
  
      console.log(`openai-chat - OpenAI API - prompt (length): ${prompt.length}, temperature: ${options.temperature}, max_tokens: ${options.max_tokens}`);
        
      let result = null;
        
        try {
          result = await openai.createChatCompletion(options);
        } catch (e) {
          console.error('openai-chat - ERROR calling OpenAI API (base model):', e);
          if (e.response?.status === 429) {
            console.warn(`openai-chat - 429 Error - ${e.response.statusText} - trying again with 16K model`);
            options.model = "gpt-3.5-turbo-16k";
            result = await openai.createChatCompletion(options);
          } else {
            throw (e);
          }
        }
  
        let response = {
          statusCode: result.status || 500,
          statusText: result.statusText,
          body: null
        };

        let body = {
            model: result.data?.model,
            object: result.data?.object,
            usage: result.data?.usage,
            payload: JSON.parse(result.data?.choices[0]?.message?.content?.replace(/\n/g, ''))
        };
  
        let costPerUnit = 0;
        switch (options.model) {
          case 'gpt-3.5-turbo':
            costPerUnit = 0.002;
            break;
          case 'gpt-3.5-turbo-16k':
            costPerUnit = 0.003;
            break;
          case 'gpt-4':
            costPerUnit = 0.03;
            break;
          default:
            break;
        }
        
        if (body.usage) {
            body.usage.estimated_cost = body.usage.total_tokens * costPerUnit/1000;
        }
        
        response.body = JSON.stringify(body);
        console.log(`openai-chat - OpenAI API - response statusCode: ${response.statusCode}, statusText: ${response.statusText}, body (length): ${response.body.length}`);

        return response;

    } catch (error) {
        console.error('openai-chat - ERROR - calling OpenAI API:', error);

        return {
            statusCode: 500,
            statusText: `Unhandled Exception`
        };
    }
}

export function cleanEmail(html) {
  try {
    console.debug(`openai-chat - cleanEmail - input (length): ${html.length}`);
    const stripped = stripHtml(html).result
    let output = stripped.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

    // Regular expression to match links in parentheses
    const regex = /\([^()]*\)/g;
  
    // Replace all occurrences of the regex pattern with an empty string
    output = output.replace(regex, '');
    console.log(`openai-chat - cleanEmail - input (length): ${html.length}, output (length): ${output.length}`);
    return output;
  } catch (e) {
    console.error(`openai-chat - cleanEmail - ERROR`, e);
    return html;
  }
}