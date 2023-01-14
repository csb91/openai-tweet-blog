import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  tweetId: {
    type: String,
    default: 'false'
  },
  tweet: String,
  created_date: Date,
  tweet_date: {
    type: String,
    default: ''
  }
})

const Tweet = mongoose.model('tweet', tweetSchema)

export default Tweet;