import React, { Component } from 'react';
import { Text, View, TextInput, TabBarIOS } from 'react-native';
import { Header } from './Header';
import { List } from './List';
import { InputBar } from './InputBar';
import { YoPass } from './YoPa';
import { styles } from '../styles/Main';


export class Main extends React.Component {
  render() {
    return (
      <TabBarIOS selectedTab={this.props.state.selectedTab}>
        <TabBarIOS.Item
          selected={this.props.state.selectedTab === 'List'}
          title={'List'}
          onPress={() => {
              this.props.updateState({
                  selectedTab: 'List',
              });
          }}>
            <View style={styles.container}>
              <Header />
              <List />
            </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.props.state.selectedTab === 'Add'}
          title={'Add'}
          onPress={() => {
              this.props.updateState({
                  selectedTab: 'Add',
              });
          }}>
            <View style={styles.container}>
              <Header />

              <View style={styles.body}>
                <InputBar updateState={this.props.updateState} />

                <YoPass pass={this.props.state.password}
                        site={this.props.state.site}
                        counter={this.props.state.counter} />
              </View>
            </View>
        </TabBarIOS.Item>

      </TabBarIOS>
    );
  }
}