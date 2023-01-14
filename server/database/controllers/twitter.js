import { config } from 'dotenv';
config();
import Twit from 'twit';
import Tweet from '../../database/models/tweets.js';

let T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.SECRET_ACCESS_TOKEN
});

export const sendTweet = (req, res) => {
  //Need to get tweet info from req, create tweet, then update db
  //tweetDb.create({tweetId: '1', tweet:'Hello World!', date: new Date()})
  //tweetDb.findOneAndUpdate({_id: "63c053fce95de8ac430ec6e2"}, {$set:{tweetId: '3'}}).catch(err => {console.log(err)})
}

export const getAllTweets = (req, res) => {
  Tweet.find()
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
}