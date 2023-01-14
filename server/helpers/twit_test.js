import { config } from 'dotenv';
config();
import Twit from 'twit';

let T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.SECRET_ACCESS_TOKEN
});

let tweet = {
  status: 'This is turning out to be harder than I expected.'
};

T.post('statuses/update', tweet)
.then(res => {console.log(res)})
.catch(err => {console.log(err)})


T.post('statuses/destroy/:id', { id: '343360866131001345' })
.then(res => {console.log(res)})
.catch(err => {console.log(err)})

T.post('statuses/retweet/:id', { id: '343360866131001345' })
.then(res => {console.log(res)})
.catch(err => {console.log(err)})