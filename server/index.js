import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import connectToDb from './database/db.js';
import Tweet from './database/models/tweets.js';
import { generateTweets } from './database/controllers/openAI.js'
import { sendTweet, getAllTweets, deleteTweet, removeTweetFromDb } from './database/controllers/twitter.js'
const app = express();

await connectToDb();

app.use(cors());
app.use(express.json());

app.get('/all', getAllTweets);
app.post('/generate', generateTweets);
app.post('/createTweet', sendTweet);
app.patch('/deleteTweet', deleteTweet);
app.delete('/removeTweetFromDb', removeTweetFromDb);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})