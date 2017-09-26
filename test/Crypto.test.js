import CryptoJS from 'crypto-js';

import Crypto from '../src/Crypto';


it('returns the secret', () => {
  const secret = Crypto.computeSecret('user', 'passphrase', 'example.com', '0');
  const expected = 'yef-xIO-WVi-TZh';
  expect(secret).toBe(expected);
});

it('implements the specs', () => {
  const secret = Crypto.computeSecret('user', 'passphrase', 'example.com', '0');

  // sha256
  const sha256 = CryptoJS.SHA256('user:passphrase:example.com:0');
  // base64
  const base64 = sha256.toString(CryptoJS.enc.Base64);
  // remove non-alpha
  const s = base64.replace(/[^0-9A-Za-z]/g, '');
  // return first 12 chars, separated by '-' every 3 chars
  const expected = `${s[0]}${s[1]}${s[2]}-${s[3]}${s[4]}${s[5]}`
    + `-${s[6]}${s[7]}${s[8]}-${s[9]}${s[10]}${s[11]}`;

  expect(secret).toBe(expected);
});
