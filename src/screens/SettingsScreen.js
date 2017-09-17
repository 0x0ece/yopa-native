import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import Utils from '../Utils';


class SettingsScreen extends React.Component {

  onImport() {
    Utils.getRemoteDocumentAsync()
      .then(result => {
        Utils.loadDataFromStoreAsync()
          .then(data => {
            this.props.dispatch({
              type: 'RELOAD_ALL',
              data: data,
            });
            this.props.navigation.goBack();
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Button
        title="Import..."
        onPress={this.onImport.bind(this)}
      />
    );
  }
}

export default connect()(SettingsScreen);
