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
    console.log(req.body)
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
  .then(results => results.data.choices[0].text.slice(1).split('\n'))
  .catch(err => {
    return Promise.reject(new Error('An error occurred while generating tweets with openAI API'));
  });
}

export const saveTweetsToDb = (tweetArray) => {
  let promises = tweetArray.map(item => {
    return new Promise((resolve, reject) => {
      Tweet.find({tweet: encodeEmojis(item.slice(3))})
      .then((result) => {
        if (!result.length) {
          Tweet.create({
            tweet: item.slice(3),
            created_date: new Date()
          })
          .then(resolve)
          .catch(reject)
        }
        else {
          resolve();
        }
      })
      .catch(reject)
    })
  });

  return Promise.all(promises);
}

export const generateTweets = (req, res) => {
  return validateInput(req)
  .then(() => generateTweetsWithAPI(req))
  .then(tweetArray => saveTweetsToDb(tweetArray))
  .then(() => Tweet.find())
  .then((dbTweets) => res.send(dbTweets))
  .catch(err => {
    res.status(500).json({error: 'Error occurred while generating tweets'})
  });
}