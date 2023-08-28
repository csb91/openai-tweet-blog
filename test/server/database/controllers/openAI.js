import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import mongoose from 'mongoose';

import { Configuration, OpenAIApi } from 'openai';
import { validateInput, generateTweetsWithAPI, saveTweetsToDb, generateTweets } from '../../../../server/database/controllers/openAI.js';
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

  context('validateInput', () => {
    it('should check for an error to eventually be thrown when the model type is missing', () => {
      request.body.model = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be thrown when the prompt is missing', () => {
      request.body.prompt = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be throw when the number of tweets are missing', () => {
      request.body.numberTweets = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    })

    it('should check for an error to eventually be throw when the temperature is missing', () => {
      request.body.temperature = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    })

    it('should check for an error to eventually be throw when the max tokens are missing', () => {
      request.body.max_tokens = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    })

    it('should resolve eventually when all the required input parameters are present', () => {

      return expect(validateInput(request)).to.be.fulfilled;
    })
  });
});