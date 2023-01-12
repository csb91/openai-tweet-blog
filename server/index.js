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
  let model = req.body.model;
  let prompt = req.body.prompt;
  let temperature = req.body.temperature;
  let max_tokens = req.body.max_tokens;
  const response = openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens
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



//Specify format of tweets
//Specify number of tweets
//Give me x tweets in x format

// "

// 1. 🤩 Check out Vue.js for your next project and make development easier - 💻#Vuejs #Programming #webdevelopment 🚀
// 2. 🤑 Build dynamic user interfaces with Vue.js - 🔌 #Vuejs #UI #WebDevelopment 🚀
// 3. 🤯 Ready to take your JavaScript skills to a whole new level? Vue.js is the way to go! 💰 #Vuejs #JavaScript #WebDevelopment 💻
// 4. ✨ Vue.js is the best way to create dynamic web pages with ease - 🤖 #Vuejs #Programming #WebDevelopment 🚀
// 5. 🔥 Vue.js is making waves with its reactive, declarative approach - 💥 #Vuejs #React #WebDevelopment 🚀"