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
  console.log(req.body)
  let dbTweetId = req.body.tweet._id;
  let tweet = {status: req.body.tweet.tweet};

  T.post('statuses/update', tweet)
  .then(response => {
    Tweet.findOneAndUpdate({_id: dbTweetId}, {$set:{tweetId: response.data.id_str, tweet_date: response.data.created_at}})
    .then(result => {console.log(result)})
    .catch(err => {console.log(err)})
  })
  .catch(err => {console.log(err)})
  res.send('done')
}

export const getAllTweets = (req, res) => {
  Tweet.find()
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
}

// T.post('statuses/update', tweet)
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})


// T.post('statuses/destroy/:id', { id: '1615555147232313344' })
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})

// T.post('statuses/retweet/:id', { id: '343360866131001345' })
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})

// data: {
//   created_at: 'Sat Jan 14 06:36:20 +0000 2023',
//   id: 1614149396920139800,
//   id_str: '1614149396920139776',
//   text: 'Working long and hard to finish this coding project. Almost there! 🔥😎 #SoftwareEngineering #coding #development.',
//   truncated: false,
//   entities: { hashtags: [Array], symbols: [], user_mentions: [], urls: [] },
//   source: '<a href="https://steria-llc.dev" rel="nofollow">Social Media Activity Job Search</a>',
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,