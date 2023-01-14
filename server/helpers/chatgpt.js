import { config } from 'dotenv';
config();
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const gptResponse = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create 2 witty tweets about React without emojis",
  temperature: 1,
  max_tokens: 200,
})