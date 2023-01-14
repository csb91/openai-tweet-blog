import { config } from 'dotenv';
config();
import Tweets from '../models/tweets.js';
import { Configuration, OpenAIApi } from 'openai';
import encodeEmojis from '../../helpers/emoji_encode.js';
import Tweet from '../../database/models/tweets.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateTweets = (req, res) => {
  console.log(req.body)
  let model = req.body.model;
  //Need to tweak the prompt model
  let prompt =
    `
    Generate ${req.body.numberTweets} tweets using this prompt: ${req.body.prompt},
    Responses should always be numbered followed by a period and a single space followed by the tweet.
    If emojis are asked for vary their locations in the tweets.
    Don't talk about emojis in the tweets.
    All of the tweets should be related to coding and software engineering and development.
    `
  let temperature = req.body.temperature;
  let max_tokens = req.body.max_tokens;
  const response = openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens
  })
  .then(results => results.data.choices[0].text.slice(1).split('\n')) //This is where to find tweets
  .then(tweetArray => {
    tweetArray.forEach(item => {
      console.log(item.slice(3))
    })
  })
  .then(results => res.send(results.data.choices)) //Need to access database after this line and add tweets to db, decoding emojis
  .catch(err => res.send(err))
}

export const sendTweet = (req, res) => {
  //Need to get tweet info from req, create tweet, then update db
  //tweetDb.create({tweetId: '1', tweet:'Hello World!', date: new Date()})
  //tweetDb.findOneAndUpdate({_id: "63c053fce95de8ac430ec6e2"}, {$set:{tweetId: '3'}}).catch(err => {console.log(err)})
}

export const getAllTweets = (req, res) => {
  tweetDb.find()
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
}


console.log(encodeEmojis('1. JavaScript developers are the real MVPs – 🏆🎉'))


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

// "
// 1. JavaScript developers are the real MVPs – 🏆🎉
// 2. I just 👂 React-ed to my favorite JavaScript song 🎵
// 3. Witty coding jokes are 🤣 Funny, but JavaScript ones are 🤩 Hilarious!
// 4. Wanna find the perfect 🤔 emoji to express your JavaScript love? 💘
// 5. 🤓 I used npm to 🧩 piece together the 🤖 perfect robot out of JavaScript
// 6. 🤔 Thinking of a new JavaScript project? 💡  Better to 🙏 pray to the 💻 gods of coding first!"