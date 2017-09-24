import Crypto from '../src/Crypto';


it('returns the secret', () => {
  const password = Crypto.computeSecret('user', 'passphrase', 'example.com', '0');
  const expected = 'yef-xIO-ViT-ZhK';
  expect(password).toBe(expected);
});
