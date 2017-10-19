import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, ScrollView, Alert, Clipboard, Text, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';

import Style from '../Style';
import { updateService, delService } from '../redux/actions';


function getStateFromProps(props) {
  const service = props.service;
  const group = props.group;

  return { value: {
    service: service.service,
    username: service.username,
    counter: service.counter,
    group: service.group,
    secret: service.getSecret(group),
  },
  };
}

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["copySecretToClipboard"] }] */
class ServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    const newState = {
      ...getStateFromProps(this.props.navigation.state.params),
      regeneratedSecret: false,
    };
    this.state = newState;

    this.generateNewSecret = this.generateNewSecret.bind(this);
    this.revertSecret = this.revertSecret.bind(this);
    this.deleteService = this.deleteService.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);

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

    const newState = {
      ...getStateFromProps(this.props.navigation.state.params),
      regeneratedSecret: true,
    };
    this.setState(newState); // FIX This
  }

  revertSecret() {
    const service = this.props.navigation.state.params.service;
    service.counter -= 1;
    this.props.navigation.setParams({ service });
    this.props.dispatch(updateService(service));

    const newState = {
      ...getStateFromProps(this.props.navigation.state.params),
      regeneratedSecret: false,
    };
    this.setState(newState); // FIX This
  }

  deleteService() {
    Alert.alert(
      'Delete site',
      `Do you really want to delete ${this.props.navigation.state.params.service.service}?`,
      [
        { text: 'Cancel' },
        { text: 'OK',
          onPress: () => {
            this.props.dispatch(delService(this.props.navigation.state.params.service));
            this.props.navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  }

  copySecretToClipboard(value) {
    Clipboard.setString(value);
  }

  touchableLabel(value) {
    return (
      <TouchableHighlight onPress={() => this.copySecretToClipboard(value)}>
        <Text style={[Style.serviceScreen_label]}>
          {value}
        </Text>
      </TouchableHighlight >
    );
  }

  secretButton() {
    if (this.state.regeneratedSecret) {
      return (
        <Button
          buttonStyle={Style.serviceScreen_button}
          containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
          loading={this.state.buttonLoading}
          onPress={this.revertSecret}
          title={'Revert Secret'}
        />
      );
    }

    return (
      <Button
        buttonStyle={Style.serviceScreen_button}
        containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
        loading={this.state.buttonLoading}
        onPress={this.generateNewSecret}
        title={'Generate new secret'}
      />
    );
  }

  counterText() {
    if (this.state.value.counter > 0) {
      return (
        <Text style={[Style.serviceScreen_text]}>
          and has been regenerated {this.state.value.counter} times.
        </Text>
      );
    }

    return (<Text />);
  }

  render() {
    return (
      <ScrollView
        style={[Style.defaultBg, Style.serviceScreen_container]}
        keyboardShouldPersistTaps="always"
      >
        <Text style={[Style.serviceScreen_note]}>
          Tap any of the highlighted elements to copy it
        </Text>

        <View style={[Style.serviceScreen_view]}>
          <Text style={[Style.serviceScreen_text]}>Password for user </Text>
          {this.touchableLabel(this.state.value.username)}
          <Text style={[Style.serviceScreen_text]}> on site </Text>
          {this.touchableLabel(this.state.value.service)}
          <Text style={[Style.serviceScreen_text]}> is </Text>
          {this.touchableLabel(this.state.value.secret)}
          {this.counterText()}
        </View>

        {this.secretButton()}

        <Button
          buttonStyle={Style.serviceScreen_button}
          containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
          loading={this.state.buttonLoading}
          onPress={this.deleteService}
          title={'Delete site'}
        />
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
