import React from 'react';
import { Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import GroupPassPrompt from './GroupPassPrompt';
import Secret from './Secret';
import { Group, Service } from '../Models';
import { unlockGroup } from '../redux/actions';


class SecretList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      promptVisible: false,
      didUnlockCallback: null,
    };

    this.handleGroupDidUnlock = this.handleGroupDidUnlock.bind(this);
    this.handleGroupWillUnlock = this.handleGroupWillUnlock.bind(this);
  }

  handleGroupDidUnlock(group, inputPassphrase) {
    // hide the passphrase prompt
    const didUnlockCallback = this.state.didUnlockCallback;
    this.setState({
      promptVisible: false,
      didUnlockCallback: null,
    });

    // dispatch the action
    const data = new Group({
      ...group,
      inputPassphrase,
      unlocked: true,
    });
    this.props.dispatch(unlockGroup(data));

    // invoke the callback, if any, with the new data
    if (didUnlockCallback) {
      didUnlockCallback.call(this, data);
    }
  }

  handleGroupWillUnlock(callback) {
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
        {services.map(s => (
          <Secret
            key={s.id}
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

SecretList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)),
  services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
  dispatch: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  group: PropTypes.instanceOf(Group),
  showGroups: PropTypes.bool,
};

SecretList.defaultProps = {
  groups: [],
  group: null,
  showGroups: false,
};

export default connect()(SecretList);
