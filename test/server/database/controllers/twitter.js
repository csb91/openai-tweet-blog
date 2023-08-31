import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import mongoose from 'mongoose';
import Twit from 'twit';

import { removeTweetFromDb, deleteTweet, getAllTweets, sendTweet} from '../../../../server/database/controllers/twitter.js';
import Tweet from '../../../../server/database/models/tweets.js';

describe('Twitter controller', () => {
  let sandbox;
  let request;
  let response;
  let findStub;
  let deleteStub;
  let findOneAndUpdateStub;
  let sampleSentTweet;
  let sampleTweet;
  let deleteTweetArgs;
  let errorStub = new Error('Mock Error');

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    request = {
      body: {
        tweet: {
          _id: '',
        }
      }
    };

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };

    sampleTweet = {
      _id: '63cb27597d5a02f88537ab84',
      tweetId: 'false',
      tweet: 'this is a test tweet',
      created_date: new Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: ''
    };

    sampleSentTweet = {
      _id: '63cb27597d5a02f88537ab84',
      tweetId: '123',
      tweet: 'this is a test tweet',
      created_date: new Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: new Date(2023, 7, 26, 12, 0, 0, 0)
    };

    findStub = sandbox.stub(mongoose.Model, 'find').resolves(sampleTweet);
    deleteStub = sandbox.stub(mongoose.Model, 'deleteOne').resolves('fake_remove_result');
    findOneAndUpdateStub = sandbox.stub(mongoose.Model, 'findOneAndUpdate').resolves(sampleTweet);
  })

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  })

  context('sendTweet', () => {
    it('should handle an error for findOneAndUpdate with status 500', async () => {
      request.body.tweet = sampleTweet;

      findOneAndUpdateStub.rejects(errorStub);
      sandbox.stub(Twit.prototype, 'post').resolves({data: { id_str: '123', created_at: new Date(2023, 7, 26, 12, 0, 0, 0)}});

      await sendTweet(request, response);

      expect(response.status).to.have.been.calledWith(500);
      expect(response.json).to.have.been.calledWith({
        error: 'An error occurred while updating the status of a tweet in the database'
      });

      sinon.restore();
    })

    it('should check for a status 400 and error message tweet id is missing', async () => {
      request.body.tweet.tweet = 'test tweet';

      await sendTweet(request, response);

      expect(response.status).to.have.been.calledWith(400);
      expect(response.json).to.have.been.calledWith({error: 'Missing tweet id'});
    })

    it('should check for a status 400 and error message when the tweet text is missing', async () => {
      request.body.tweet._id = '123';

      await sendTweet(request, response);

      expect(response.status).to.have.been.calledWith(400);
      expect(response.json).to.have.been.calledWith({error: 'Missing tweet text'});
    })

    it('should successfully call findOneAndUpdate', async () => {
      request.body.tweet = sampleTweet;
      sandbox.stub(Twit.prototype, 'post').resolves({data: { id_str: '123', created_at: new Date(2023, 7, 26, 12, 0, 0, 0)}});

      await sendTweet(request, response);

      expect(response.send).to.have.been.calledOnceWith(sampleTweet);
      expect(findOneAndUpdateStub).to.have.been.calledOnceWith(
        {_id: '63cb27597d5a02f88537ab84'},
        {$set:{tweetId: '123', tweet_date: new Date(2023, 7, 26, 12, 0, 0, 0)}},
        {new: true}
      );
    })
  })

  context('getAllTweets', () => {
    it('should handle an error with status 500', async () => {
      findStub.rejects(errorStub);

      await getAllTweets(request, response);

      expect(response.status).to.have.been.calledWith(500);
      expect(response.json).to.have.been.calledOnceWith(
        { error: 'An error occurred while retrieving all tweets from the database' }
        );
    })

    it('should call getAllTweets', async () => {
      request = {};

      await getAllTweets(request, response);

      expect(response.send).to.have.been.calledOnceWith(sampleTweet);
      expect(findStub).to.have.been.calledWith();
    });
  })


  context('deleteTweet', () => {
    it('should handle an error for findOneAndUpdate with status 500', async () => {
      request.body.tweet._id = '123';
      request.body.tweet.tweetId = '123';

      findOneAndUpdateStub.rejects(errorStub);
      sandbox.stub(Twit.prototype, 'post').resolves();

      await deleteTweet(request, response);

      expect(response.status).to.have.been.calledWith(500);
      expect(findOneAndUpdateStub).to.have.been.calledOnce;
      expect(findOneAndUpdateStub).to.have.been.calledWith({_id: '123'});
    })

    it('should check for a status 400 and error message when twitter tweet id is missing', async () => {
      await deleteTweet(request, response);

      expect(response.status).to.have.been.calledWith(400);
      expect(response.json).to.have.been.calledWith({error: 'Missing twitter tweet id'});
    })

    it('should check for a status 400 and error message when the tweet id is missing', async () => {
      request.body.tweet.tweetId = '123';

      await deleteTweet(request, response);

      expect(response.status).to.have.been.calledWith(400);
      expect(response.json).to.have.been.calledWith({error: 'Missing tweet id'})
    })

    it('should successfully call findOneAndUpdate', async () => {
      request.body.tweet = sampleSentTweet;
      sandbox.stub(Twit.prototype, 'post').resolves();

      await deleteTweet(request, response);

      expect(response.send).to.have.been.calledWith(sampleTweet);
      expect(findOneAndUpdateStub).to.have.been.calledWith(
        {_id: '63cb27597d5a02f88537ab84'},
        {$set:{tweetId: 'false', tweet_date: ''}},
        {new: true}
        );
    })
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
      });
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