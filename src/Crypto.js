import CryptoJS from 'crypto-js';


const Crypto = {

  verifyPassphrase(value, encPass) {
    /*
      salt = CryptoJS.lib.WordArray.random(128/8);
      salt.toString(CryptoJS.enc.Base64)+":"+CryptoJS.PBKDF2("mypassphrase", salt,
        { keySize: 512/32, iterations: 10000 }).toString(CryptoJS.enc.Base64);
      // "vML2T6YiaaBgbztKaMJmsg==:"
      // "v9koIbdE5LWzSBtVrHohc63dw0OjGPpvIwhi4WvsoDM2OQorF62EkhYZuL81gEGbcBbVtMz/SYS83UFUbBvbFw=="
    */
    const encArr = encPass.split(':');
    const salt = CryptoJS.enc.Base64.parse(encArr[0]);
    const encValue = CryptoJS.PBKDF2(value, salt, {
      keySize: 512 / 32,
      iterations: 10000,
    }).toString(CryptoJS.enc.Base64);

    return encValue === encArr[1];
  },

  computeSecret(username, passphrase, service, counter, extra) {
    /*
      CryptoJS.SHA256("user:passphrase:example.com:0").toString(CryptoJS.enc.Base64)
        .match(/[a-zA-Z0-9]{3}/g).slice(0,4).join("-")
      // "yef-xIO-ViT-ZhK"
    */
    const base = [username, passphrase, service, counter].join(':');
    const params = extra || {};
    const separator = params.separator || '-';
    return CryptoJS.SHA256(base)
      .toString(CryptoJS.enc.Base64)
      .match(/[a-zA-Z0-9]{3}/g)
      .slice(0, 4)
      .join(separator);
  },

};

export default Crypto;
