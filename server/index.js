import express from 'express';
import { config } from 'dotenv';
config();
import cors from 'cors'
import connectToDb from './database/db.js'
const app = express();

app.use(cors());
app.use(express.json());

const tweet = await connectToDb();

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// const response = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "Create 4 witty tweets about React without emojis",
//   temperature: 1,
//   max_tokens: 200,
// }).then(res => {console.log(res.data.choices)})

tweet.create({tweetId: '1', tweet:'Hello World!', date: new Date()})
tweet.find().then(res => {console.log(res)})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/new', (req, res) => {
  console.log(req.body)
  const response = openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Create 10 viral tweets about react, make some of them contain polls in twitter format",
    temperature: 0.5,
    max_tokens: 1000,
  }).then(results => {res.send(results.data.choices)})
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})