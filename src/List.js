import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { DocumentPicker, FileSystem } from 'expo';
import yaml from 'js-yaml';

import { styles } from '../styles/Main';


export class List extends React.Component {


  onClick() {
    DocumentPicker.getDocumentAsync({ 'type': 'text/*' })
      .then(result => {
        if (result.type == 'success') {
          const fileSrc = result.uri;
          const fileDst = FileSystem.documentDirectory + 'data.yml';
          FileSystem.downloadAsync(fileSrc, fileDst)
          .then(({ uri }) => {
            FileSystem.readAsStringAsync(fileDst).then(txt => {
              const data = yaml.safeLoad(txt);
              console.log(data);
            });
          })
          .catch(error => {
            console.error(error);
          });
        }
      });
  }

  render() {
    return(
      <View style={styles.body}>
        <Text>List of passwords</Text>
        <Button
          onPress={this.onClick}
          title="Tap me"
        />
      </View>
    )
  }
}