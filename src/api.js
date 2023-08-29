import axios from 'axios';

export const getAllTweets = (endpoint) => {
  const url = endpoint.url;
  const port = endpoint.port;

  return axios.request({
    method: 'GET',
    baseURL: `${url}:${port}`,
    url: '/all',
    headers: {
      Accept: [
        'application/problem+json',
        'application/json',
        'text/plain',
        '*/*',
      ],
    },
  });
};