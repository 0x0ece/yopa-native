import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, Alert, Clipboard } from 'react-native';
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


const Form = t.form.Form;
class ServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromProps(this.props.navigation.state.params);

    this.generateNewSecret = this.generateNewSecret.bind(this);
    this.revertSecret = this.revertSecret.bind(this);
    this.deleteService = this.deleteService.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.copySecretToClipboard = this.copySecretToClipboard.bind(this);

    // here we are: define your domain model
    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      counter: t.Integer,
      group: t.String,
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
      'Delete site',
      `Do you really want to delete ${this.props.navigation.state.params.service.service}?`,
      [
        { text: 'Cancel' },
        { text: 'OK',
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
                placeholder: 'example.com',
              },
              username: {
                label: 'Username or email',
              },
              counter: {
                label: 'Counter',
              },
              group: {
                label: 'Group',
              },
              secret: {
                label: 'Secret',
              },
            },
          }}
        />

        <Button
          icon={{ name: 'done', size: 32 }}
          buttonStyle={Style.primaryButton}
          containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
          loading={this.state.buttonLoading}
          onPress={this.generateNewSecret}
          title={'Generate new secret'}
        />

        <Button
          icon={{ name: 'refresh', size: 32 }}
          buttonStyle={Style.primaryButton}
          containerViewStyle={{ marginLeft: 0, marginRight: 0, marginBottom: 2 }}
          loading={this.state.buttonLoading}
          onPress={this.revertSecret}
          title={'Revert secret'}
        />

        <Button
          icon={{ name: 'cancel', size: 32 }}
          buttonStyle={Style.primaryButton}
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
