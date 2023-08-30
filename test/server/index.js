import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);


import mongoose from 'mongoose';
import { removeTweetFromDb, deleteTweet, getAllTweets, sendTweet} from '../../server/database/controllers/twitter.js';
import Tweet from '../../server/database/models/tweets.js';
import server from '../../server/index.js'

describe('API tests', () => {
  let sandbox;
  let findStub;
  let sampleTweet;
  let multipleTweets;
  let errorStub = new Error('Mock Error')

  before(() => {

  })

  after(() => {
    server.close();
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sampleTweet = {
      _id: '63cb27597d5a02f88537ab84',
      tweetId: 'false',
      tweet: 'this is a test tweet',
      created_date: new Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: ''
    };

    multipleTweets = [sampleTweet, sampleTweet]

    findStub = sandbox.stub(mongoose.Model, 'find').resolves();
  })

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  })

  context('/all', () => {
    it('should handle a database error', (done) => {
      findStub.rejects(errorStub);

      chai.request(server)
      .get('/all')
      .end((err, res) => {
        expect(res).to.have.status(500)
        done()
      });
    });

    it('should GET all tweets', (done) => {
      sampleTweet.created_date = Date(2023, 7, 26, 12, 0, 0, 0)
      findStub.resolves(multipleTweets);

      chai.request(server)
      .get('/all')
      .end((err, res) => {
        expect(findStub).to.have.been.calledOnce;
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal([sampleTweet, sampleTweet])
        done()
      });
    });
  });
})