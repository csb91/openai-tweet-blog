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
  let findStub;
  let createStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    request = {
      body: {
        model: '',
        prompt: '',
        numberTweets: '',
        temperature: '',
        max_tokens: ''
      }
    };

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  it('should check for an error to eventually be thrown when the model type is missing', () => {
    request.body.prompt = 'create tweets about react';
    request.body.numberTweets = 3;
    request.body.temperature = 1;
    request.body.max_tokens = 500;


    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing model type');
  });

  it('should check for an error to eventually be thrown when the prompt is missing', () => {
    request.body.numberTweets = 3;
    request.body.temperature = 1;
    request.body.max_tokens = 500;
    request.body.model = 'text-davinci-003';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing prompt');
  });

  it('should check for an error to eventually be thrown when the number of tweets is missing', () => {
    request.body.prompt = 'create tweets about react';
    request.body.temperature = 1;
    request.body.max_tokens = 500;
    request.body.model = 'text-davinci-003';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing number of tweets');
  });

  it ('should check for an error to eventually be thrown when the temperature is missing', () => {
    request.body.prompt = 'create tweets about react';
    request.body.numberTweets = 3;
    request.body.max_tokens = 500;
    request.body.model = 'text-davinci-003';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing temperature');
  });

  it('should check for an error to eventually be thrown when the max tokens is missing', () => {
    request.body.prompt = 'create tweets about react';
    request.body.numberTweets = 3;
    request.body.temperature = 1;
    request.body.model = 'text-davinci-003';

    return expect(generateTweets(request, response)).to.be.eventually.rejectedWith('Missing max tokens');
  });

});