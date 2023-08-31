import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);


import mongoose from 'mongoose';
import { removeTweetFromDb, deleteTweet, getAllTweets, sendTweet} from '../../server/database/controllers/twitter.js';
import Tweet from '../../server/database/models/tweets.js';
import server from '../../server/index.js';
import Twit from 'twit';

describe('API tests', () => {
  let sandbox;
  let generateRequest;
  let tweetRequest;
  let findStub;
  let sampleTweet;
  let multipleTweets;
  let errorStub = new Error('Mock Error');

  before(() => {

  });

  after(() => {
    //server.close();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sampleTweet = {
      tweet: {
        _id: '63cb27597d5a02f88537ab84',
        tweetId: 'false',
        tweet: 'this is a test tweet',
        created_date: new Date(2023, 7, 26, 12, 0, 0, 0),
        tweet_date: ''
      }
    };

    multipleTweets = [sampleTweet, sampleTweet];

    generateRequest = {
      model: 'text-davinci-003',
      prompt: 'create tweets about react',
      numberTweets: 3,
      temperature: 1,
      max_tokens: 500
    };

  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  context('/all', () => {
    it('should handle a database error', (done) => {
      findStub = sandbox.stub(mongoose.Model, 'find').rejects(errorStub);

      chai.request(server)
      .get('/all')
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
    });

    it('should GET all tweets', (done) => {

      chai.request(server)
      .get('/all')
      .end((err, res) => {
        expect(findStub).to.have.been.calledOnce;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
    });

    it('should GET all tweets if request is null', (done) => {

      chai.request(server)
      .get('/all')
      .send(null)
      .end((err, res) => {
        expect(findStub).to.have.been.calledOnce;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });

  xcontext('/generate', () => {
    it('should POST request to generate tweets successfully and return tweets', (done) => {

      chai.request(server)
      .post('/generate')
      .send(generateRequest)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.type).to.equal('application/json');
        done();
      });
    });
  });

  context('/createTweet', () => {
    it('should respond with status 400 when tweet id is missing', (done) => {
      delete sampleTweet.tweet._id;

      chai.request(server)
      .post('/createTweet')
      .send(sampleTweet)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('{"error":"Missing tweet id"}');
        done();
      });
    });

    it('should respond with status 400 when tweet text is missing', (done) => {
      delete sampleTweet.tweet.tweet;

      chai.request(server)
      .post('/createTweet')
      .send(sampleTweet)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('{"error":"Missing tweet text"}');
        done();
      })
    })

    it('should POST tweet to twitter', (done) => {
      sandbox.stub(Twit.prototype, 'post').resolves({data: { id_str: '123', created_at: Date(2023, 7, 26, 12, 0, 0, 0)}});

      chai.request(server)
      .post('/createTweet')
      .send(sampleTweet)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.tweetId).to.equal('123')
        expect(res).to.be.json;
        done();
      });
    });
  });
})