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
  console.log('a',req.body)
  return new Promise((resolve, reject) => {
    if (!req.body.model || !req.body.prompt || !req.body.numberTweets || !req.body.temperature || !req.body.max_tokens) {
      reject(new Error('Missing required input parameter'));
    } else {
      resolve();
    }
  });
}

export const generateTweetsWithAPI =  (req) => {
  console.log('b', req.body)
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
    console.log(results.data.choices[0].text.slice(1).split('\n'))
    return results.data.choices[0].text.slice(1).split('\n')
  })
  .catch(err => {
    console.log('Are we here??')
    return Promise.reject(new Error('An error occurred while generating tweets with openAI API'));
  });
}

export const findTweetInDb = (tweet) => {
  console.log('c', tweet)
  return Tweet.find({
    tweet: encodeEmojis(tweet)
  })
  .catch(err => {
    throw new Error('An error occurred while finding a tweet in the database');
  })
}

export const createNewTweet = (tweet) => {
  console.log('d',tweet)
  return Tweet.create({
    tweet: tweet,
    created_date: new Date()
  })
  .then(res => console.log('asdfdf', res))
  .catch(err => {
    return Promise.reject(new Error('An error occurred while generating tweets with openAI API'));
  })
}

export const saveSingleTweetToDb = (tweet) => {
  console.log('e',tweet)
  return findTweetInDb(tweet)
    .then((result) => {
      if (!result.length) {
        return createNewTweet(tweet)
      }
    })
}

export const saveTweetsToDb = (tweetArray) => {
  console.log('f', tweetArray)
  let promises = tweetArray.map((item) => saveSingleTweetToDb(item.slice(3)));

  return Promise.all(promises);
}

export const generateTweets = (req, res) => {
  console.log(req.body)
  return validateInput(req)
  .then(() => generateTweetsWithAPI(req))
  .then(tweetArray => {
    console.log(tweetArray)
    return saveTweetsToDb(tweetArray)
  })
  .then(() => {
    console.log('ere')
    return Tweet.find()})
  .then((dbTweets) => {
    console.log('dbTWEEETS', dbTweets)
    res.send(dbTweets)})
  .catch(err => {
    res.status(500).json({error: 'Error occurred while generating tweets'})
  });
}