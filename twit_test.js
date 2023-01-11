import Twit from 'twit';
import { config } from 'dotenv';
config();

let T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.SECRET_ACCESS_TOKEN
});

let tweet = {
  status: '🤔',
  poll_fields: {
  options: ['Red','Blue','Green'],
  duration_minutes: 1440
  }
};

T.post('statuses/update', tweet)
.catch(err => {console.log(err)})
.then(res => {console.log(res)})
