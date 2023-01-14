import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import connectToDb from './database/db.js';
import Tweet from './database/models/tweets.js';
import { generateTweets, sendTweet, getAllTweets } from './database/controllers/controllers.js'
const app = express();

await connectToDb();

app.use(cors());
app.use(express.json());

app.get('/all', getAllTweets);
app.post('/generate', generateTweets);
app.post('/createTweet', sendTweet);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})