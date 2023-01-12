const emojiRegex = require('emoji-regex');

function encodeEmojis(text) {
  const emojiMatches = text.match(emojiRegex());
  if (!emojiMatches) {
    return text;
  }
  let encodedText = text;
  emojiMatches.forEach((emoji) => {
    encodedText = encodedText.replace(emoji, encodeURIComponent(emoji));
  });
  return encodedText;
}

const newTweet = new tweet({
  tweetId: '1',
  tweet: encodeEmojis('Hello World 😊'),
  date: new Date()
});

const encodedString = 'Hello%20World%20%F0%9F%98%8A';
const decodedString = decodeURIComponent(encodedString);
console.log(decodedString); // "Hello World 😊"


const tweet = await tweetModel.find();
const decodedTweet = decodeURIComponent(tweet[0].tweet)
console.log(decodedTweet) // "Hello World 😊"
