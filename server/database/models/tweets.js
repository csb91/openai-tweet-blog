import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  tweetId: {
    type: String,
    default: 'false'
  },
  tweet: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  tweet_date: {
    type: String,
    default: ''
  }
})

const Tweet = mongoose.model('tweet', tweetSchema)

export default Tweet;