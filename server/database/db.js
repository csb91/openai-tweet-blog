import { config } from 'dotenv';
config();
import mongoose from 'mongoose';

const connectToDb = async () => {
  await mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)
  .then(() => {console.log(`Mongoose connected to ${process.env.DB_NAME}`)})
  .catch((err) => console.log(err))

  const tweetSchema = new mongoose.Schema({
    tweetId: {
      type: String,
      default: ''
    },
    tweet: String,
    created_date: Date,
    tweet_date: {
      type: String,
      default: ''
    }
  })

  const Tweet = mongoose.model('tweet', tweetSchema)
  return Tweet;
}

export default connectToDb;
