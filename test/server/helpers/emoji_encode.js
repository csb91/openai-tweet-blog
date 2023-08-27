import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import encodeEmojis from '../../../server/helpers/emoji_encode.js';

describe('emoji encoder testing', () => {
  let text;

  beforeEach(() => {
    text = '';
  })

  it('should check for text using return', () => {
    return encodeEmojis(text)
    .then((result) => {
      throw new Error('unexpected success');
    })
    .catch((err) => {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.equal('Missing text for emoji matching');
    })
  })

  it('should check for an error to be thrown eventually', () => {
    expect(encodeEmojis(text)).to.eventually.be.rejectedWith('Missing text for emoji matching');
  })

  it('should return the text as is if no emoji matches are found', () => {
    let text = 'there are no emojis in this string';

    expect(encodeEmojis(text)).to.equal('there are no emojis in this string');
  })

  it('should return a string with emojis encoded if a single emoji is present', () => {
    let text = 'There is 1️⃣ emoji in this string';

    expect(encodeEmojis(text)).to.equal('There is 1%EF%B8%8F%E2%83%A3 emoji in this string')
  })

  it('should return a string with all emojis encoded if multiple emojis are present', () => {
    let text = '💻 😰 🪲 🍺'

    expect(encodeEmojis(text)).to.equal('%F0%9F%92%BB %F0%9F%98%B0 %F0%9F%AA%B2 %F0%9F%8D%BA')
  })

  it('should return a string with emojis encoded when international characters are used', () => {
    let text = 'これは、絵文字エンコーダーの動作方法には影響しません 💻 😰 🪲 🍺'

    expect(encodeEmojis(text)).to.equal(
      'これは、絵文字エンコーダーの動作方法には影響しません %F0%9F%92%BB %F0%9F%98%B0 %F0%9F%AA%B2 %F0%9F%8D%BA'
      )
  })
})