import React from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';

import GroupPassPrompt from './GroupPassPrompt';
import Secret from './Secret';
import { unlockGroup } from '../redux/actions';


class SecretList extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      promptVisible: false,
      didUnlockCallback: null,
    };
  }

  handleGroupDidUnlock = (group, value) => {
    // hide the passphrase prompt
    const didUnlockCallback = this.state.didUnlockCallback
    this.setState({
      promptVisible: false,
      didUnlockCallback: null,
    });

    // dispatch the action
    const data = {
      ...group,
      inputPassphrase: value,
      unlocked: true,
    };
    this.props.dispatch(unlockGroup(data));

    // invoke the callback, if any, with the new data
    if (didUnlockCallback) {
      didUnlockCallback.call(this, data);
    }
  }

  handleGroupWillUnlock = (callback) => {
    // show the passphrase prompt
    this.setState({
      promptVisible: true,
      didUnlockCallback: callback,
    });
  }

  render() {
    const groupsProps = this.props.groups || [];
    const servicesProps = this.props.services || [];
    const filter = this.props.group ? this.props.group.group : 'default';
    const groups = groupsProps.filter(g => g.group !== 'default');
    const services = servicesProps.filter(s => s.group === filter);
    const mainGroup = this.props.group || groupsProps[0];

    return (
      <View>
        {this.props.showGroups ? groups.map(g => (
          <Button
            key={g.group}
            title={`Group: ${g.group}`}
            onPress={() => this.props.navigate('Group', { group: g })}
          />
        )) : null}
        {services.map((s, i) => (
          <Secret
            key={i}
            navigate={this.props.navigate}
            service={s}
            group={mainGroup}
            onGroupWillUnlock={this.handleGroupWillUnlock}
          />
        ))}
        <GroupPassPrompt
          group={mainGroup}
          visible={this.state.promptVisible}
          onCancel={() => { this.setState({ promptVisible: false }); }}
          onGroupDidUnlock={this.handleGroupDidUnlock}
        />
      </View>
    );
  }
}

export default connect()(SecretList);
