import { Amplitude } from 'expo';

import Config from './Config';


const Analytics = {

  ENABLED: false,

  SECRET_ACTION_COPY: 'copy',
  SECRET_ACTION_VIEW: 'view',

  SCREEN_MAIN: 'main',
  SCREEN_GROUP: 'group',
  SCREEN_SEARCH: 'search',
  SCREEN_SERVICE: 'service',

  initialize() {
    if (Analytics.ENABLED) {
      Amplitude.initialize(Config.AMPLITUDE_API_KEY);
    }
  },

  setUserProperties() {
    // Amplitude.setUserProperties(userProperties);
  },

  logSecretGet(action, screen) {
    // action: copy, view
    // screen: main, group, search, service
    if (Analytics.ENABLED) {
      Amplitude.logEvent('secret_get', { action, screen });
    }
  },

  logServiceAdd() {
    if (Analytics.ENABLED) {
      Amplitude.logEvent('service_add');
    }
  },

};

export default Analytics;
