import chai from 'chai';
import { expect } from 'chai';
import path from 'path';
import { PactV3, MatchersV3, SpecificationVersion, } from "@pact-foundation/pact";
import { Pact, Matchers } from '@pact-foundation/pact';
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';
const { eachLike, like } = MatchersV3;
import { getAllTweets } from './api.js'

describe('The Tweet API', () => {
  let url = 'http://127.0.0.1';
  const port = 8992;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2,
    consumer: 'MyConsumer',
    provider: 'MyProvider',
    logLevel: LOG_LEVEL,
  });

  const EXPECTED_BODY = [
    {
      _id: '63cb27597d5a02f88537ab84',
      tweetId: 'false',
      tweet: 'this is a test tweet',
      created_date: Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: '',
    },
    {
      _id: '63cb27597d5a02f88537ab85',
      tweetId: 'false',
      tweet: 'this is a second test tweet',
      created_date: Date(2023, 7, 26, 12, 0, 0, 0),
      tweet_date: '',
    },
  ];

  // Setup the provider
  before(() => provider.setup());

  // Write Pact when all tests done
  after(() => provider.finalize());

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify());

  describe('get /all', () => {
    before(() => {
      const interaction = {
        state: 'i have a list of tweets',
        uponReceiving: 'a request for all tweets',
        withRequest: {
          method: 'GET',
          path: '/all',
          headers: {
            // Accept: 'application/problem+json, application/json, text/plain, */*', // <- fails, must use array syntax ❌
            Accept: [
              'application/problem+json',
              'application/json',
              'text/plain',
              '*/*',
            ],
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: EXPECTED_BODY,
        },
      };
      return provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const urlAndPort = {
        url: url,
        port: port,
      };
      const response = await getAllTweets(urlAndPort);
      expect(response.data).to.eql(EXPECTED_BODY);
    });
  });
});