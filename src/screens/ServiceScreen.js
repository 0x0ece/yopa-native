import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ActionSheetIOS, ScrollView, Alert, Clipboard, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import Style from '../Style';
import { updateService, delService } from '../redux/actions';


function getStateFromProps(props) {
  const service = props.service;
  const group = props.group;

  return { value: {
    service: service.service,
    username: service.username,
    secret: service.getSecret(group),
  },
  };
}


const Form = t.form.Form;
class ServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromProps(this.props.navigation.state.params);

    this.handlePress = this.handlePress.bind(this);
    this.generateNewSecret = this.generateNewSecret.bind(this);
    this.revertSecret = this.revertSecret.bind(this);
    this.deleteService = this.deleteService.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);

    // here we are: define your domain model
    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      secret: t.String,
    });

    // this.onImport = this.onImport.bind(this);
  }

  componentWillMount() {
    this.setState({
      canAddService: false,
    });
  }

  generateNewSecret() {
    const service = this.props.navigation.state.params.service;
    service.counter += 1;
    this.props.dispatch(updateService(service));
    this.props.navigation.setParams({ service });
    this.setState(getStateFromProps(this.props.navigation.state.params)); // FIX This
  }

  revertSecret() {
    const service = this.props.navigation.state.params.service;
    service.counter -= 1;
    this.props.navigation.setParams({ service });
    this.props.dispatch(updateService(service));
    this.setState(getStateFromProps(this.props.navigation.state.params)); // FIX This
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
    const state = this.getState();
    Clipboard.setString(state.value.secret);
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
    }, index => {
      switch(index) {
        case options.length - 2:
          this.deleteService();
          break;
        case 0:
          this.generateNewSecret();
          break;
        case 1:
          this.revertSecret();
          break;
      }
    });
  }

  render() {
    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="always"
      >
        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputService}
          value={this.state.value}
          onChange={this.onChange}
          options={{
            fields: {
              service: {
                label: 'Site',
                placeholder: 'example.com',
                editable: false,
              },
              username: {
                label: 'Username or email',
                editable: false,
              },
              secret: {
                label: 'Password',
                editable: false,
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
/*
          <Button
            buttonStyle={Style.secondaryButton}
            disabled={service.counter <= 0}
            containerViewStyle={{ marginLeft: 0, marginRight: 0, flex: 1 }}
            onPress={this.revertSecret}
            leftIcon={{ name: "replay", size: 20 }}
          />
          <Button
            buttonStyle={[Style.secondaryButton, { alignItems: 'center', justifyContent: 'center' }]}
            containerViewStyle={{ marginLeft: 0, marginRight: 0, flex: 1 }}
            onPress={this.deleteService}
            rightIcon={{ name: "more-horiz", size: 20 }}
          />
*/

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
