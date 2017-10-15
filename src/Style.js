import { StyleSheet } from 'react-native';

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

// plate28
const Color = {
  // bgMustard: '#DFAF25', // orig
  // bgMustard: '#deaf26', // marg
  mustard: '#dfa22c', // ec
  // bgMustard: '#dfa22c', // ec
  bgGray: '#404b4e',
  bgLigthGray: '#eee',
  // bgGray: '#545b5d',
  bgPurple: '#4b3a4c',
  bgWhite: '#fff',
  // textMustard: '#dfa22c',
  textGray: '#545b5d',
  textGrayLight: '#999',
  textGrayDone: '#BBB',
  textPurple: '#4b3a4c',
  textWhite: '#fff',
  touchWhite: '#fff',
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
  // container: {
  //   flex: 1,
  //   height: 100,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // header: {
  //   flex: 1,
  //   marginTop: 50,
  //   color: 'red',
  //   fontWeight: 'bold',
  // },
  // body: {
  //   flex: 4,
  // },
  // inputBar: {
  //   flex: 2,
  // },
  // mempa: {
  //   flex: 5,
  // },
  defaultBg: {
    backgroundColor: 'white',
  },

  headerIcon: {
    // color: '#007aff',
    color: 'white',
    padding: 10,
  },

  container: {
    padding: 20,
  },

  primaryButton: {
    backgroundColor: '#4b3a4c',
  },

  formLabel: {
    color: LABEL_COLOR,
    fontSize: FONT_SIZE,
    marginBottom: 7,
    fontWeight: FONT_WEIGHT,
    // color: '#4b3a4c',
  },

  cancelButtonText: {
    color: 'blue',
  },

  groupListContainer: {
    backgroundColor: '#e9e9ee',
    marginTop: 0,
    borderTopWidth: 0,
    paddingBottom: 20,
    borderBottomWidth: 1,
    // marginBottomColor: '#bbb',
  },
});

export default Styles;
export {
  Color,
};

