import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import tweetSchema from './models/tweets.js';

mongoose.set('strictQuery', false);

const connectToDb = async () => {
  await mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)
  .then(() => {console.log(`Mongoose connected to ${process.env.DB_NAME}`)})
  .catch((err) => console.log(err))
}

export default connectToDb;