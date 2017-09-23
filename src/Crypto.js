import CryptoJS from 'crypto-js';


const Crypto = {

  verifyPassphrase: function(value, encPass) {
    /*
      salt = CryptoJS.lib.WordArray.random(128/8);
      salt.toString(CryptoJS.enc.Base64)+":"+CryptoJS.PBKDF2("mypassphrase", salt, { keySize: 512/32, iterations: 10000 }).toString(CryptoJS.enc.Base64);
      //"vML2T6YiaaBgbztKaMJmsg==:v9koIbdE5LWzSBtVrHohc63dw0OjGPpvIwhi4WvsoDM2OQorF62EkhYZuL81gEGbcBbVtMz/SYS83UFUbBvbFw=="
    */
    const encArr = encPass.split(":");
    const salt = CryptoJS.enc.Base64.parse(encArr[0]);
    const encValue = CryptoJS.PBKDF2(value, salt, {
      keySize: 512/32,
      iterations: 10000,
    }).toString(CryptoJS.enc.Base64);

    return encValue === encArr[1];
  },

  computeSecret: function(username, passphrase, service, counter, extra) {
    return `secret for ${service}`;
  },

};

export default Crypto;
