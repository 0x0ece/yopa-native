import { PixelRatio, StyleSheet } from 'react-native';

// const reactNativeElementColors {
//   primary: '#9E9E9E',
//   primary1: '#4d86f7',
//   primary2: '#6296f9',
//   secondary: '#8F0CE8',
//   secondary2: '#00B233',
//   secondary3: '#00FF48',
//   grey0: '#393e42',
//   grey1: '#43484d',
//   grey2: '#5e6977',
//   grey3: '#86939e',
//   grey4: '#bdc6cf',
//   grey5: '#e1e8ee',
//   dkGreyBg: '#232323',
//   greyOutline: '#bbb',
//   searchBg: '#303337',
//   disabled: '#dadee0',
//   white: '#ffffff',
//   error: '#ff190c',
// };

const PRIMARY = '#ff2d54';
const BACKGROUND = 'white';

const Color = {
  primary: PRIMARY,
  alert: 'red',

  appBg: BACKGROUND,
  headerBg: BACKGROUND,
  headerBorder: BACKGROUND,
  headerTitle: 'black',
  headerIcon: PRIMARY,

  settingsBg: '#f0eff5',

  checkboxChecked: PRIMARY,
  checkboxBlank: '',
  switch: PRIMARY,

  buttonPrimary: PRIMARY,

  // plate28
  mustard: '#dfa22c', // ec
  bgGray: '#404b4e',
  bgLigthGray: '#eee',
  bgPurple: '#4b3a4c',
  bgWhite: '#fff',
  textGray: '#545b5d',
  textGrayLight: '#999',
  textGrayDone: '#BBB',
  textPurple: '#4b3a4c',
  textWhite: '#fff',

  // apple
  appleMusicPink: '#ff2d54',
  appleBlue: '#007aff',
  appleSettingsBg: '#f0eff5',
  appleSettingsBorder: '#c8c8ca',
  appleSettingsBorderBottom: '#c8c7cc',
};

// tcomb
const LABEL_COLOR = '#000000';
// const INPUT_COLOR = '#000000';
// const ERROR_COLOR = '#a94442';
// const HELP_COLOR = '#999999';
// const BORDER_COLOR = '#cccccc';
// const DISABLED_COLOR = '#777777';
// const DISABLED_BACKGROUND_COLOR = '#eeeeee';
const FONT_SIZE = 17;
const FONT_WEIGHT = '500';

const Styles = StyleSheet.create({

  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },

  defaultBg: {
    backgroundColor: 'white',
  },

  headerIcon: {
    color: Color.headerIcon,
    paddingLeft: 15,
    paddingRight: 15,
  },

  container: {
    padding: 20,
  },

  primaryButton: {
    backgroundColor: Color.buttonPrimary,
  },

  formLabel: {
    color: LABEL_COLOR,
    fontSize: FONT_SIZE,
    marginBottom: 7,
    fontWeight: FONT_WEIGHT,
  },

  cancelButtonText: {
    color: Color.primary,
  },

  groupListContainer: {
    backgroundColor: 'white',
    marginTop: 0,
    borderTopWidth: 0,
    paddingBottom: 20,
  },

  // settings
  settingsDivider: {
    height: 1 / PixelRatio.get(),
    marginLeft: 20,
  },

  settingsItem: {
    height: 48,
    justifyContent: 'center',
    borderBottomWidth: 0,
  },

  settingsInputItem: {
    marginTop: 4,
    marginBottom: 4,
    borderBottomWidth: 0,
  },

  settingsList: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: Color.appleSettingsBorder,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Color.appleSettingsBorderBottom,
  },

});

export default Styles;
export {
  Color,
};

