import { Platform, StatusBar } from 'react-native';

const Config = {

  PRODUCTION: false,

  AMPLITUDE_API_KEY: 'cbafe8abda90290beea53eb177ab25f2',

  SERVICE_AUTO_DESCRIPTION: {
    google: 'gmail gplus gdocs',
    facebook: 'messenger',
  },

  Android: (Platform.OS === 'android'),
  DeviceSecurity: undefined,
  HeaderMarginTop: (Platform.OS === 'android') ? StatusBar.currentHeight : 0,
  HeaderMarginBottom: (Platform.OS === 'android') ? 5 : 0,

};

export default Config;
