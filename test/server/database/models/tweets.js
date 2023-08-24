import chai from 'chai';
import { expect } from 'chai';

import Tweet from '../../../../server/database/models/tweets.js';

describe('Tweet model', () => {
  it('should have tweetId field initialize to false', (done) => {
    let tweet = new Tweet();

    expect(tweet).to.have.property('tweetId').to.equal('false');
    done();
  })

  it('should have tweet_date field initialized to an empty string', (done) => {
    let tweet = new Tweet();

    expect(tweet).to.have.property('tweet_date').to.equal('');
    done();
  })

  it('should return an error if required fields are missing', (done) => {
    let tweet = new Tweet();

    tweet.validate((err) => {
      expect(err.errors.tweet).to.exist;
      expect(err.errors.created_date).to.exist;

      done();
    })
  })
})