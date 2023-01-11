import express from 'express';
import { config } from 'dotenv';
config();
import cors from 'cors'
const app = express();

app.use(cors());
app.use(express.json());

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Create 10 viral tweets about react, make some of them contain polls in twitter format",
  temperature: 0,
  max_tokens: 1000,
}).then(res => {console.log(res.data.choices)})



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/new', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})