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

tweet.create({tweet:'Hello World!', created_date: new Date()})
//tweet.findOneAndUpdate({_id: "63c053fce95de8ac430ec6e2"}, {$set:{tweetId: '3'}}).catch(err => {console.log(err)})
//tweet.find().then(res => {console.log(res)})

app.get('/all', (req, res) => {
  tweet.find()
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
})

app.post('/generate', (req, res) => {
  console.log(req.body)
  let model = req.body.model;
  let prompt =
    ```
    Generate
    ```
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


// 1. 🤩 Check out Vue.js for your next project and make development easier - 💻#Vuejs #Programming #webdevelopment 🚀
// 2. 🤑 Build dynamic user interfaces with Vue.js - 🔌 #Vuejs #UI #WebDevelopment 🚀
// 3. 🤯 Ready to take your JavaScript skills to a whole new level? Vue.js is the way to go! 💰 #Vuejs #JavaScript #WebDevelopment 💻
// 4. ✨ Vue.js is the best way to create dynamic web pages with ease - 🤖 #Vuejs #Programming #WebDevelopment 🚀
// 5. 🔥 Vue.js is making waves with its reactive, declarative approach - 💥 #Vuejs #React #WebDevelopment 🚀"

// 1.👏🏼 Wow! We made it to 5,000 followers 👏🏼 #happy #buildingcommunity #spreadthelove 🤗
// 2. Check out the new site we just launched 🎉 #projectcomplete #amazingsupport 🙌
// 3. New video up now and it's a must watch! 🤩 #unlockinnovation #techtrends 🤓
// 4. Ready to take the next step? 🤔 #investingtime #believeinyourself ✨
// 5. Celebrating success with a virtual hi-5 🙌 #goalsmet #letsdothis 💪"

//"[{\"text\":\"\\n\\n1. 🤯 React and Javascript are so powerful together 💯 #Javascript #React #Mongoose #Express\\n2. Added Mongoose support to my React project and it made it so much easier to interact with the DB 🤙 #Mongoose #React\\n3. I never thought I'd be satisfied building web apps, until I discovered React and Express 🔥 #React #Express\\n4. React rocks my world! 🤩 Without it, I wouldn't have the tools I need to develop awesome sites #React #Javascript\\n5. Mongoose and Express together for rapid prototyping 🤩 #Mongoose #Express\\n6. Wow! 🤩 React and Javascript together is an unstoppable combination for web development #Javascript #React\\n7. Just finished a cool side project with React, Javascript and Express 🔥 #Javascript #React #Express\\n8. Mongoose makes interacting with the DB a breeze 🤩 #Mongoose\\n9. Learning React and Express 🔥 #React #Express\\n10. Definitely feeling the power of React and Mongoose 💪 #React #Mongoose\\n11. Got another project done and this time I used React and Mongoose 🤩 #React #Mongoose\\n12. Just completed an awesome web app using React and Express 🤯 #React #Express\\n13. Who knew that React and Javascript could do so much! 🤯 #Javascript #React\\n14. Unstoppable combination of React and Mongoose 🤩 #React #Mongoose\\n15. That React and Express combo 🔥 💯 #React #Express\\n16. Mongoose and Express together are 🔥 #Mongoose #Express\\n17. Exciting new projects await with React and Javascript 🤩 #Javascript #React\",\"index\":0,\"logprobs\":null,\"finish_reason\":\"length\"}]"
