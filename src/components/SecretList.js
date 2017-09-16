import React from 'react';
import { Button, View } from 'react-native';

export default class SecretList extends React.Component {
  render() {
    const groups = this.props.groups || [];
    const servicesProp = this.props.services || [];
    const filter = this.props.filter || 'default';
    const services = servicesProp.filter(s => s.group == filter);

    return (
      <View>
        {this.props.showGroups ? groups.map( g => (
          <Button
            key={g.group}
            title={"Group: " + g.group}
            onPress={() => this.props.navigate('Group', { group: g.group })}
          />
        )) : null}
        {services.map( s => (
          <Button
            key={s.service}
            title={"Service: " + s.service}
            onPress={() => this.props.navigate('Service', { service: s.service })}
          />
        ))}
      </View>
    );
  }
}
