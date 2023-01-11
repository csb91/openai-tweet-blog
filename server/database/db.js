import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)

const tweetSchema = new mongoose.Schema({
  tweetId: String,
  tweet: String,
  date: Date
})

const Tweet = mongoose.model('tweet', tweetSchema)



