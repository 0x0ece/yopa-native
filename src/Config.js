import { Platform } from 'react-native';

const Config = {

  PRODUCTION: false,

  AMPLITUDE_API_KEY: 'cbafe8abda90290beea53eb177ab25f2',

  Android: (Platform.OS === 'android'),

};

export default Config;
