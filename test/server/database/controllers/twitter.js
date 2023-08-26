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

describe('Twitter controller', () => {
  let sandbox = sinon.createSandbox();
  let request;
  let response;
  let findStub;
  let deleteStub;
  let sampleArgs;
  let sampleTweet;
  const errorStub = new Error('Mock Error');

  beforeEach(() => {
    request = {
      body: {
        tweet: {
          _id: ''
        }
      }
    }

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };

    sampleTweet = {
      _id: '63cb27597d5a02f88537ab84',
      tweetID: 'false',
      tweet: 'this is a test tweet',
      created_date: new Date,
      tweet_date: ''
    };

    findStub = sandbox.stub(mongoose.Model, 'find').resolves(sampleTweet);
    deleteStub = sandbox.stub(mongoose.Model, 'deleteOne').resolves('fake_remove_result');
  })

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  })

  context('getAllTweets', () => {
    it('should handle an error with status 500', async () => {
      findStub.rejects(errorStub);

      await getAllTweets(request, response);

      expect(response.status).to.have.been.calledWith(500);
      expect(response.json).to.have.been.calledOnceWith({ error: 'An error occurred while retrieving all tweets from the database' })
    })

    it('should call getAllTweets', async () => {
      request = {};

      await getAllTweets(request, response);

      expect(response.send).to.have.been.calledOnceWith(sampleTweet);
      expect(findStub).to.have.been.calledWith();
    });
  })

  context('removeTweetFromDb', () => {
    it('should check for an id using return', () => {
      return removeTweetFromDb(request, response)
      .then((result) => {
        throw new Error('unexpected success');
      })
      .catch((err) => {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Missing tweet id');
      })
    })

    it('should check for an error to be thrown eventually', () => {
      return expect(removeTweetFromDb(request, response)).to.be.eventually.rejectedWith('Missing tweet id');
    })

    it('should call removeTweetFromDb', async () => {
      request.body.tweet._id = '123';

      await removeTweetFromDb(request, response);

      expect(response.send).to.have.been.calledWith('fake_remove_result');
      expect(deleteStub).to.have.been.calledWith({ _id: '123' });
    })
  })
})