import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import mongoose from 'mongoose';

import { removeTweetFromDb, deleteTweet, getAllTweets, sendTweet} from '../../../../server/database/controllers/twitter.js';
import Tweet from '../../../../server/database/models/tweets.js';

let sandbox = sinon.createSandbox()

describe('twitter', () => {
  let request;
  let deleteStub;
  let sampleArgs;
  let sampleTweet;

  beforeEach(() => {
    request = {
      body: {
        tweet: {
          _id: ''
        }
      }
    }
    sampleTweet = {
      tweet: 'this is a test tweet',
      created_date: new Date,
      tweet_date: ''
    }

    deleteStub = sandbox.stub(mongoose.Model, 'deleteOne').resolves('fake_remove_result');
  })

  afterEach(() => {
    sandbox.restore();
  })

  context('removeTweetFromDb', () => {
    it('should check for an id using return', () => {
      return removeTweetFromDb(request)
      .then((result) => {
        throw new Error('unexpected success');
      })
      .catch((err) => {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Missing tweet id');
      })
    })

    it('should check for an error to be thrown eventually', () => {
      return expect(removeTweetFromDb(request)).to.be.eventually.rejectedWith('Missing tweet id');
    })

    it('should call removeTweetFromDb', async () => {
      request.body.tweet._id = '123';
      let result = await removeTweetFromDb(request)

      expect(result).to.equal('fake_remove_result');
      expect(deleteStub).to.have.been.calledWith({ _id: '123' })
    })
  })
})