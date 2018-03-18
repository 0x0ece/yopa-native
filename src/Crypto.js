import CryptoJS from 'crypto-js';


const Crypto = {

  encryptPassphrase(value) {
    /*
      salt = CryptoJS.lib.WordArray.random(128/8);
      salt.toString(CryptoJS.enc.Base64)+":"+CryptoJS.PBKDF2("mypassphrase", salt,
        { keySize: 512/32, iterations: 10000 }).toString(CryptoJS.enc.Base64);
      // "vML2T6YiaaBgbztKaMJmsg==:"
      // "v9koIbdE5LWzSBtVrHohc63dw0OjGPpvIwhi4WvsoDM2OQorF62EkhYZuL81gEGbcBbVtMz/SYS83UFUbBvbFw=="
    */
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    return `${salt.toString(CryptoJS.enc.Base64)}:${CryptoJS.PBKDF2(value, salt,
      { keySize: 512 / 32, iterations: 10000 }).toString(CryptoJS.enc.Base64)}`;
  },

  verifyPassphrase(value, encPass) {
    const encArr = encPass.split(':');
    const salt = CryptoJS.enc.Base64.parse(encArr[0]);
    const encValue = CryptoJS.PBKDF2(value, salt, {
      keySize: 512 / 32,
      iterations: 10000,
    }).toString(CryptoJS.enc.Base64);

    return encValue === encArr[1];
  },

  computeSecret(username, passphrase, counter, service, length, extra) {
    /*
      CryptoJS.SHA256("user:passphrase:0:example.com").toString(CryptoJS.enc.Base64)
        .match(/[a-zA-Z0-9]{3}/g).slice(0,4).join("-")
      // "uBP-8Pe-5xM-mBe"
    */
    const base = [username, passphrase, counter, service].join(':');
    const params = extra || {};
    const separator = params.separator || '-';
    return CryptoJS.SHA256(base)
      .toString(CryptoJS.enc.Base64)
      .replace(/[^0-9A-Za-z]/g, '')
      .substring(0, length)
      .match(/.{3}/g)
      .join(separator);
  },

};

export default Crypto;
