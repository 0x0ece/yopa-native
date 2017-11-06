import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import {
  ActionSheetIOS,
  Alert,
  Clipboard,
  Linking,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';

import RectButton from '../components/RectButton';
import Style from '../Style';
import { Service } from '../Models';
import { updateService, delService } from '../redux/actions';


function callbackTemplate(locals, iconName, onPressCallback) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let textboxStyle = stylesheet.textbox.normal;
  let textboxViewStyle = stylesheet.textboxView.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    textboxViewStyle = stylesheet.textboxView.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
    textboxViewStyle = stylesheet.textboxView.notEditable;
  }

  const label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  const help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <RectButton
        onPress={() => onPressCallback(locals.value)}
        style={[textboxViewStyle,
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: textboxStyle.marginBottom,
          }]}
      >
        <TextInput
          accessibilityLabel={locals.label}
          autoCapitalize={locals.autoCapitalize}
          autoCorrect={locals.autoCorrect}
          autoFocus={locals.autoFocus}
          blurOnSubmit={locals.blurOnSubmit}
          editable={locals.editable}
          keyboardType={locals.keyboardType}
          maxLength={locals.maxLength}
          multiline={locals.multiline}
          onBlur={locals.onBlur}
          onEndEditing={locals.onEndEditing}
          onFocus={locals.onFocus}
          onLayout={locals.onLayout}
          onSelectionChange={locals.onSelectionChange}
          onSubmitEditing={locals.onSubmitEditing}
          onContentSizeChange={locals.onContentSizeChange}
          placeholderTextColor={locals.placeholderTextColor}
          secureTextEntry={locals.secureTextEntry}
          selectTextOnFocus={locals.selectTextOnFocus}
          selectionColor={locals.selectionColor}
          numberOfLines={locals.numberOfLines}
          underlineColorAndroid={locals.underlineColorAndroid}
          clearButtonMode={locals.clearButtonMode}
          clearTextOnFocus={locals.clearTextOnFocus}
          enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
          keyboardAppearance={locals.keyboardAppearance}
          onKeyPress={locals.onKeyPress}
          returnKeyType={locals.returnKeyType}
          selectionState={locals.selectionState}
          onChangeText={value => locals.onChange(value)}
          onChange={locals.onChangeNative}
          placeholder={locals.placeholder}
          style={[textboxStyle, { flex: 1, marginBottom: 0 }]}
          value={locals.value}
        />
        <Icon name={iconName} style={{ width: 32, alignItems: 'center' }} />
      </RectButton>
      {help}
      {error}
    </View>
  );
}

function copyTemplate(locals) {
  return callbackTemplate(locals, 'content-copy', (value) => {
    Clipboard.setString(value);
  });
}

function linkTemplate(locals) {
  return callbackTemplate(locals, 'link', (value) => {
    Linking.openURL(`https://${value}`);
  });
}


const Form = t.form.Form;
class ServiceScreen extends React.Component {
  constructor(props) {
    super(props);

    const params = props.navigation.state.params;
    const service = params.service;
    const group = params.group;
    this.state = {
      value: {
        service: service.service,
        username: service.username,
        secret: service.getSecret(group),
      },
    };

    this.handlePress = this.handlePress.bind(this);
    this.updateSecret = this.updateSecret.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);

    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      secret: t.String,
    });
  }

  updateSecret(counterIncrement) {
    const params = this.props.navigation.state.params;
    const service = params.service;
    const group = params.group;

    const newService = new Service({
      ...service,
      counter: service.counter += counterIncrement,
    });

    this.props.dispatch(updateService(newService));
    this.props.navigation.setParams({ service: newService });
    this.setState({
      value: {
        ...this.state.value,
        secret: newService.getSecret(group),
      },
    });
  }

  deleteService() {
    Alert.alert(
      `Do you really want to delete ${this.props.navigation.state.params.service.service}?`,
      '',
      [
        { text: 'Cancel' },
        { text: 'OK',
          style: 'destructive',
          onPress: () => {
            this.props.dispatch(delService(this.props.navigation.state.params.service));
            this.props.navigation.goBack();
          } },
      ],
      { cancelable: false },
    );
  }

  copySecretToClipboard() {
    Clipboard.setString(this.state.value.secret);
  }

  handlePress() {
    const service = this.props.navigation.state.params.service;

    const options = service.counter > 0 ? [
      'Generate new password',
      'Revert previous password',
      'Delete site',
      'Cancel',
    ] : [
      'Generate new password',
      'Delete site',
      'Cancel',
    ];
    ActionSheetIOS.showActionSheetWithOptions({
      options,
      cancelButtonIndex: options.length - 1,
      destructiveButtonIndex: options.length - 2,
    }, (index) => {
      switch (index) {
        case options.length - 2:
          this.deleteService();
          break;
        case 0:
          this.updateSecret(1);
          break;
        case 1:
          this.updateSecret(-1);
          break;
        default:
          break;
      }
    });
  }

  render() {
    return (
      <ScrollView style={[Style.defaultBg, Style.container]}>
        <Form
          type={this.InputService}
          value={this.state.value}
          options={{
            fields: {
              service: {
                label: 'Site',
                placeholder: 'example.com',
                editable: false,
                template: linkTemplate,
              },
              username: {
                label: 'Username or email',
                editable: false,
                template: copyTemplate,
              },
              secret: {
                label: 'Password',
                editable: false,
                template: copyTemplate,
              },
            },
          }}
        />

        <View style={{ marginTop: 10 }}>
          <Button
            buttonStyle={Style.primaryButton}
            containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            onPress={this.handlePress}
            title="Edit site..."
          />
        </View>

      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
  };
}

ServiceScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ServiceScreen);
