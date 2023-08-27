import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import mongoose from 'mongoose';

import { Configuration, OpenAIApi } from 'openai';
import { generateTweets } from '../../../../server/database/controllers/openAI.js';
import Tweet from '../../../../server/database/models/tweets.js';

describe('openAI Controller', () => {
  let sandbox;
  let request;
  let response;
  let sampleTweet;
  let findStub;
  let createStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    request = {
      body: {
        model: 'text-davinci-003',
        prompt: 'create tweets about react',
        numberTweets: 3,
        temperature: 1,
        max_tokens: 500
      }
    };

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub()
    };

    sampleTweet = {
      _id: '63cb27597d5a02f88537ab84',
      tweetId: 'false',
      tweet: 'this is a test tweet',
      created_date: new Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: ''
    };
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  it('should check for an error to eventually be thrown when the model type is missing', () => {
    request.body.model = '';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing model type');
  });

  it('should check for an error to eventually be thrown when the prompt is missing', () => {
    request.body.prompt = '';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing prompt');
  });

  it('should check for an error to eventually be thrown when the number of tweets is missing', () => {
    request.body.numberTweets = '';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing number of tweets');
  });

  it ('should check for an error to eventually be thrown when the temperature is missing', () => {
    request.body.temperature = '';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing temperature');
  });

  it('should check for an error to eventually be thrown when the max tokens is missing', () => {
    request.body.max_tokens = '';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing max tokens');
  });

});