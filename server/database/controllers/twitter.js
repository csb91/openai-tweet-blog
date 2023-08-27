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
  let dbTweetId = req.body.tweet._id;
  let tweet = {status: req.body.tweet.tweet};

  if (!dbTweetId) {
    return Promise.reject(new Error('Missing tweet id'));
  }

  if(!tweet[status]) {
    return Promise.reject(new Error('Missing tweet text'));
  }

  return T.post('statuses/update', tweet)
  .then(response => {
    return Tweet.findOneAndUpdate({_id: dbTweetId}, {$set:{tweetId: response.data.id_str, tweet_date: response.data.created_at}}, {new: true})
    .then(results => {return results})
    .catch(err => {
      res.status(500).json({error: 'An error occurred while updating the status of a tweet in the database'})
    })
  })
  .then(test =>  res.send(test))
  .catch(err => {
    res.status(500).json({error: 'An error occurred while posting a tweet on Twitter'})
  })
}

export const getAllTweets = (req, res) => {
  return Tweet.find()
  .then(results => res.send(results))
  .catch(err => {
    res.status(500).json({error: 'An error occurred while retrieving all tweets from the database'});
  })
}

export const deleteTweet = (req, res) => {
  let tweetIdTwitter = req.body.tweet.tweetId;
  let dbTweetId = req.body.tweet._id;

  if (!tweetIdTwitter) {
    return Promise.reject(new Error('Missing twitter tweet id'));
  }

  if (!dbTweetId) {
    return Promise.reject(new Error('Missing tweet id'));
  }

  return T.post('statuses/destroy/:id', { id: tweetIdTwitter })
  .then(() => {
    return Tweet.findOneAndUpdate({_id: dbTweetId}, {$set:{tweetId: 'false', tweet_date: ''}}, {new: true})
    .then(results => res.send(results))
    .catch(err => {
      res.status(500).json({error: 'An error occurred while updating the status of a tweet in the database'});
    })
  })
  .catch(err => {
    res.status(500).json({error: 'An error occurred while deleting a tweet from Twitter'});
  })
}

export const removeTweetFromDb = (req, res) => {
  let dbTweetId = req.body.tweet._id;

  if (!dbTweetId) {
    return Promise.reject(new Error('Missing tweet id'));
  }

  return Tweet.deleteOne({_id: dbTweetId})
  .then(results => res.send(results))
  .catch(err => {
    res.status(500).json({error: 'An error occurred while deleting a tweet from the database'});
  })
}


// T.post('statuses/retweet/:id', { id: '343360866131001345' })
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})