import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView, Text } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

import Style, { Color } from '../Style';
import Config from '../Config';
import Utils from '../Utils';
import { Group } from '../Models';
import { initGroup } from '../redux/actions';


const Form = t.form.Form;


class InitGroupScreen extends React.Component {
  constructor(props) {
    super(props);

    const defaultSecurityLevel = Config.DeviceSecurity ?
      Group.SEC_LEVEL_DEVICE : Group.SEC_LEVEL_ENCRYPTED;

    const securityLevel = this.props.group.defaultSecurityLevel !== undefined ?
      this.props.group.defaultSecurityLevel : defaultSecurityLevel;

    this.state = {
      buttonLoading: false,
      buttonDisabled: true,
      securityLevel,
      value: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);

    // here we are: define your domain model
    this.InputGroup = t.struct({
      passphrase: t.String,
    });
  }

  handleChange(value) {
    this.setState({
      value,
      buttonDisabled: value.passphrase.length === 0,
    });
  }

  handlePress() {
    this.setState({ buttonLoading: true });

    // HACK(ec): async otherwise the loading spinner doesn't work on iphone7/ios11.0.3
    setTimeout(() => {
      const formData = this.form.getValue();
      if (formData) {
        const group = Utils.updateGroup(this.props.group, formData.passphrase,
          this.state.securityLevel);
        this.props.navigation.setParams({ group });
        this.props.dispatch(initGroup(group));
      }
    }, 0);
  }

  render() {
    const options = Utils.getGroupSecurityLevels();
    return (
      <ScrollView
        style={[Style.defaultBg, Style.container]}
        keyboardShouldPersistTaps="never"
      >
        <Form
          ref={(c) => { this.form = c; }}
          type={this.InputGroup}
          value={this.state.value}
          onChange={this.handleChange}
          options={{
            fields: {
              passphrase: {
                label: 'Choose a very strong master password',
                placeholder: 'correcthorsebatterystaple',
                autoCapitalize: 'none',
                autoCorrect: false,
                // EC: autoFocus removed based on user testing
                // (it seems better to see the full page and explicitly input the master pass)
                // autoFocus: true,
              },
            },
          }}
        />

        <Text style={[Style.formLabel, { marginTop: 10 }]}>
          {'Choose your security'}
        </Text>
        <Text>{'If unsure, leave the default'}</Text>
        <List
          style={{ marginBottom: 30 }}
        >
          {options.map((o, i) => (
            <ListItem
              key={o.title}
              containerStyle={{}}
              leftIcon={{
                name: (i === this.state.securityLevel) ? 'check-box' : 'check-box-outline-blank',
                color: (i === this.state.securityLevel) ? Color.checkboxChecked
                  : Color.checkboxBlank,
              }}
              leftIconContainerStyle={{ justifyContent: 'flex-start' }}
              title={o.title}
              titleStyle={[Style.formLabel, { marginBottom: 0 }]}
              subtitle={o.desc.join('\n')}
              subtitleNumberOfLines={4}
              subtitleStyle={{ fontWeight: 'normal' }}
              hideChevron
              onPress={() => { this.setState({ securityLevel: i }); }}
            />
          ))}
        </List>

        <Button
          buttonStyle={Style.primaryButton}
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          disabled={this.state.buttonDisabled}
          loading={this.state.buttonLoading}
          onPress={this.handlePress}
          title="Save"
        />

      </ScrollView>
    );
  }
}

InitGroupScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect()(InitGroupScreen);
