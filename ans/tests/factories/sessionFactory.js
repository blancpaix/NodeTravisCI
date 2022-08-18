const Keygrip = require('keygrip');
const keys = require('../../config/dev');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: user._id.toString() || '62f0dd5155f5ee336c1eedfa',
    }
  };

  const session = Buffer.from(
    JSON.stringify(sessionObject)
  ).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig, };
}