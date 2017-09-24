import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import Utils from '../Utils';
import { reloadAll } from '../redux/actions';


class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onImport = this.onImport.bind(this);
  }

  onImport() {
    Utils.getRemoteDocumentAsync()
      .then(() => {
        Utils.loadDataFromStoreAsync()
          .then((data) => {
            this.props.dispatch(reloadAll(data));
            this.props.navigation.goBack(null);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <Button
        title="Import..."
        onPress={this.onImport}
      />
    );
  }
}

export default connect()(SettingsScreen);
