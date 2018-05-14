import { Platform, ToastAndroid } from 'react-native';
import { Fingerprint } from 'expo';

class FingerprintWithAndroidModal {
  constructor() {
    this.promise = null;
  }

  authenticateAsync(): Promise<Fingerprint.FingerprintAuthenticationResult> {
    if (!this.promise) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Authenticate with fingerprint', ToastAndroid.LONG);
      }
      this.promise = Fingerprint.authenticateAsync();
    }
    return this.promise;
  }

}

export default new FingerprintWithAndroidModal();
