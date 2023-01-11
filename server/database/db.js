import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const connectToDb = async () => {
  await mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`);
  mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open');
  });

  const tweetSchema = new mongoose.Schema({
    tweetId: String,
    tweet: String,
    date: Date
  })

  const Tweet = mongoose.model('tweet', tweetSchema)
  return Tweet;
}

export default connectToDb;
