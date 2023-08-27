import { config } from 'dotenv';
config();
import { Configuration, OpenAIApi } from 'openai';
import encodeEmojis from '../../helpers/emoji_encode.js';
import Tweet from '../../database/models/tweets.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateTweets = (req, res) => {
  let model = req.body.model;
  let prompt =
    `
    Generate ${req.body.numberTweets} tweets using this prompt: ${req.body.prompt},
    Responses should always be numbered followed by a period and a single space followed by the tweet.
    Responses should always be numbered followed by a period and a single space followed by the tweet.
    `
  let temperature = req.body.temperature;
  let max_tokens = req.body.max_tokens;

  if (!model) {
    return Promise.reject(new Error('Missing model type'));
  }

  if (!req.body.prompt) {
    return Promise.reject(new Error('Missing prompt'));
  }

  if (!req.body.numberTweets) {
    return Promise.reject(new Error('Missing number of tweets'));
  }

  if (!temperature) {
    return Promise.reject(new Error('Missing temperature'));
  }

  if (!max_tokens) {
    return Promise.reject(new Error('Missing max tokens'));
  }

  const response = openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens
  })
  .then(results => results.data.choices[0].text.slice(1).split('\n'))
  .then(tweetArray => {
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
    return Promise.all(promises)
  })
  .then(() => {return Tweet.find()})
  .then(dbTweets => res.send(dbTweets))
  .catch(err => res.send(err))
}