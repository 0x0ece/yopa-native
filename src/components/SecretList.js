import React from 'react';
import { Button, Text, View } from 'react-native';

import Secret from './Secret';


export default class SecretList extends React.Component {
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
          <Secret key={s.service} service={s} navigate={this.props.navigate} group={mainGroup} />
        ))}
      </View>
    );
  }
}
