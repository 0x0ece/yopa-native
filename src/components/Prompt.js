import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';


const styles = StyleSheet.create({
  dialog: {
    flex: 1,
    alignItems: 'center',
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dialogContent: {
    elevation: 5,
    marginTop: 150,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dialogTitle: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dialogErrorText: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    height: 30,
  },
  dialogBody: {
    paddingHorizontal: 10,
  },
  dialogInput: {
    height: 50,
    fontSize: 18,
  },
  dialogFooter: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dialogAction: {
    // justifyContent: 'space-around',
    // flex: 1,
    padding: 10,
  },
  dialogActionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#006dbf',
  },
});


class Prompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue,
      visible: this.props.visible || false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitPress = this.onSubmitPress.bind(this);
    this.onCancelPress = this.onCancelPress.bind(this);
    this.close = this.close.bind(this);
    this.renderDialog = this.renderDialog.bind(this);
  }

  onChangeText(value) {
    this.setState({ value });
    this.props.onChangeText(value);
  }

  onSubmitPress() {
    const { value } = this.state;
    this.props.onSubmit(value);
  }

  onCancelPress() {
    this.props.onCancel();
  }

  close() {
    this.setState({ visible: false });
  }

  renderDialog() {
    const {
      title,
      placeholder,
      defaultValue,
      cancelText,
      submitText,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      inputStyle,
    } = this.props;
    return (
      <View style={styles.dialog} key="prompt">
        <View style={styles.dialogOverlay} />
        <View style={[styles.dialogContent, { borderColor }, promptStyle]}>
          <View style={[styles.dialogTitle, { borderColor }]}>
            <Text style={[styles.dialogTitleText, titleStyle]}>
              { title }
            </Text>
          </View>
          <View style={styles.dialogBody}>
            <TextInput
              style={[styles.dialogInput, inputStyle]}
              defaultValue={defaultValue}
              onChangeText={this.onChangeText}
              placeholder={placeholder}
              autoFocus
              underlineColorAndroid="white"
              autoCapitalize="none"
              autoCorrect={false}
              {...this.props.textInputProps}
            />
            { (this.props.errorMessage) ?
              <Text style={[styles.dialogErrorText]}>
                {this.props.errorMessage}
              </Text> :
              null
            }
          </View>
          <View style={[styles.dialogFooter, { borderColor }]}>
            <TouchableOpacity onPress={this.onCancelPress}>
              <View style={[styles.dialogAction, buttonStyle, cancelButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, cancelButtonTextStyle]}>
                  {cancelText}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onSubmitPress}>
              <View style={[styles.dialogAction, buttonStyle, submitButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, submitButtonTextStyle]}>
                  {submitText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Modal onRequestClose={() => this.close()} transparent visible={this.props.visible}>
        {this.renderDialog()}
      </Modal>
    );
  }
}

Prompt.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  borderColor: PropTypes.string,
  promptStyle: ViewPropTypes.style,
  titleStyle: ViewPropTypes.style,
  buttonStyle: ViewPropTypes.style,
  buttonTextStyle: ViewPropTypes.style,
  submitButtonStyle: ViewPropTypes.style,
  submitButtonTextStyle: ViewPropTypes.style,
  cancelButtonStyle: ViewPropTypes.style,
  cancelButtonTextStyle: ViewPropTypes.style,
  inputStyle: ViewPropTypes.style,
  /* eslint react/forbid-prop-types:off */
  textInputProps: PropTypes.object,
  errorMessage: PropTypes.string,
};

Prompt.defaultProps = {
  visible: false,
  defaultValue: '',
  cancelText: 'Cancel',
  submitText: 'OK',
  borderColor: '#ccc',
  placeholder: '',
  promptStyle: {},
  titleStyle: {},
  buttonStyle: {},
  buttonTextStyle: {},
  textInputProps: {},
  submitButtonStyle: {},
  submitButtonTextStyle: {},
  cancelButtonStyle: {},
  cancelButtonTextStyle: {},
  inputStyle: {},
  onChangeText: () => {},
  errorMessage: '',
};

export default Prompt;
