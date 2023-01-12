import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import connectToDb from './database/db.js';
import generateText from './helpers/chatgpt.js'
import { Configuration, OpenAIApi } from 'openai';

const app = express();

app.use(cors())
app.use(express.json());

const tweet = await connectToDb();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

tweet.create({tweetId: '1', tweet:'Hello World!', date: new Date()})
tweet.find().then(res => {console.log(res)})

app.get('/all', (req, res) => {
  tweet.find()
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
})

app.post('/generate', (req, res) => {
  console.log(req.body)
  let model = "text-davinci-003";
  let prompt = "No, going forward can you remember my prompts and the responses you give?";
  let temperature = 0.5;
  let max_tokens = 300;
  const response = openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens,
  })
  .then(results => {res.send(results.data.choices)})
  .catch(err => res.statusCode(500).send(err))
})

app.post('/createTweet', (req, res) => {
  //tweet.create({tweetId: '1', tweet:'Hello World!', date: new Date()})
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})