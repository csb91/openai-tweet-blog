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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

describe('openAI Controller', () => {
  let sandbox;
  let request;
  let response;
  let sampleTweet;
  let createCompletionStub;
  let findStub;
  let createStub;
  let errorStub = new Error('Mock error');

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

    createCompletionStub = sandbox.stub(OpenAIApi.prototype, 'createCompletion').resolves({data: {choices: [{text: ' 1. This is a tweet\n2. This is another tweet\n3. One more tweet'}]}});
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  context('validateInput', () => {
    it('should check for an error to eventually be thrown when the model type is missing', () => {
      request.body.model = ''

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be thrown when the prompt is missing', () => {
      request.body.prompt = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be throw when the number of tweets are missing', () => {
      request.body.numberTweets = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be throw when the temperature is missing', () => {
      request.body.temperature = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should check for an error to eventually be throw when the max tokens are missing', () => {
      request.body.max_tokens = '';

      return expect(validateInput(request)).to.be.eventually.rejectedWith('Missing required input parameter');
    });

    it('should resolve eventually when all the required input parameters are present', () => {

      return expect(validateInput(request)).to.be.fulfilled;
    });
  });

  context('generateTweetsWithAPI', () => {
    it('should return error when there is an issue with createCompletion', () => {
      createCompletionStub.rejects(errorStub);

      return expect(generateTweetsWithAPI(request)).to.be.eventually.rejectedWith('An error occurred while generating tweets with openAI API');
    });

    it('should return generated tweets correctly split into an array for each tweet when multiple tweets generated', async () => {
      let results = await generateTweetsWithAPI(request);

      expect(results).to.deep.equal(['1. This is a tweet', '2. This is another tweet', '3. One more tweet']);
      expect(createCompletionStub).to.have.been.calledOnceWith({
        model: 'text-davinci-003',
        prompt:'\n  Generate 3 tweets using this prompt: create tweets about react,\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  ',
        temperature: 1,
        max_tokens: 500
      });
    });

    it('should return generated tweet correctly split into array when there is only a single tweet generated', async () => {
      request.body.numberTweets = 1;
      createCompletionStub.resolves({data: {choices: [{text: ' 1. This is the only tweet'}]}});

      let results = await generateTweetsWithAPI(request);

      expect(results).to.deep.equal(['1. This is the only tweet']);
      expect(createCompletionStub).to.have.been.calledOnceWith({
        model: 'text-davinci-003',
        prompt:'\n  Generate 1 tweets using this prompt: create tweets about react,\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  ',
        temperature: 1,
        max_tokens: 500
      });
    });

    it('should return an array with an empty string if no tweets are generated', async () => {
      request.body.numberTweets = 0;
      createCompletionStub.resolves({data: {choices: [{text: ''}]}});

      let results = await generateTweetsWithAPI(request);

      expect(results).to.deep.equal([''])
      expect(createCompletionStub).to.have.been.calledOnceWith({
        model: 'text-davinci-003',
        prompt:'\n  Generate 0 tweets using this prompt: create tweets about react,\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  Responses should always be numbered followed by a period and a single space followed by the tweet.\n  ',
        temperature: 1,
        max_tokens: 500
      });
    });

  })
});