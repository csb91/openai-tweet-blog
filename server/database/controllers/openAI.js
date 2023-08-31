import { config } from 'dotenv';
config();
import { Configuration, OpenAIApi } from 'openai';
import encodeEmojis from '../../helpers/emoji_encode.js';
import Tweet from '../../database/models/tweets.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const validateInput = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.body.model || !req.body.prompt || !req.body.numberTweets || !req.body.temperature || !req.body.max_tokens) {
      reject(new Error('Missing required input parameter'));
    } else {
      resolve();
    }
  });
}

export const generateTweetsWithAPI =  (req) => {
  const { model, temperature, max_tokens } = req.body;
  let prompt =
  `
  Generate ${req.body.numberTweets} tweets using this prompt: ${req.body.prompt},
  Responses should always be numbered followed by a period and a single space followed by the tweet.
  Responses should always be numbered followed by a period and a single space followed by the tweet.
  `

  return openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens
  })
  .then(results => {
    return results.data.choices[0].text.slice(1).split('\n')
  })
  .catch(err => {
    return Promise.reject(new Error('An error occurred while generating tweets with openAI API'));
  });
}

export const findTweetInDb = (tweet) => {
  return Tweet.find({
    tweet: encodeEmojis(tweet)
  })
  .catch(err => {
    throw new Error('An error occurred while finding a tweet in the database');
  })
}

export const createNewTweet = (tweet) => {
  return Tweet.create({
    tweet: tweet,
    created_date: new Date()
  })
  .catch(err => {
    return Promise.reject(new Error('An error occurred while generating tweets with openAI API'));
  })
}

export const saveSingleTweetToDb = (tweet) => {
  return findTweetInDb(tweet)
    .then((result) => {
      if (!result.length) {
        return createNewTweet(tweet)
      }
    })
}

export const saveTweetsToDb = (tweetArray) => {
  let promises = tweetArray.map((item) => saveSingleTweetToDb(item.slice(3)));

  return Promise.all(promises);
}

export const generateTweets = (req, res) => {
  return validateInput(req)
  .then(() => generateTweetsWithAPI(req))
  .then(tweetArray => {
    return saveTweetsToDb(tweetArray)
  })
  .then(() => {
    return Tweet.find()
  })
  .then((dbTweets) => {
    res.send(dbTweets)
  })
  .catch(err => {
    res.status(500).json({error: 'Error occurred while generating tweets'})
  });
}