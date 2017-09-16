import React from 'react';
import { Button, View } from 'react-native';


const HomeScreen = ({ navigation }) => {
  navigate = (page, options) => {
    navigation.navigate(page, options);
  };

  return (
    <View>
      <Button
        title="Folder: Work"
        onPress={() => this.navigate('Folder', { folder: 'Work' })}
      />
      <Button
        title="Folder: Important"
        onPress={() => this.navigate('Folder', { folder: 'Important' })}
      />
      <Button
        title="Service: Zero"
        onPress={() => this.navigate('Service', { service: 'Zero' })}
      />
    </View>
  );
};

export default HomeScreen;
