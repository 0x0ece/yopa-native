import React from 'react';
import { Button, View } from 'react-native';


const FolderScreen = ({ navigation }) => {
  navigate = (page, options) => {
    navigation.navigate(page, options);
  };

  return (
    <View>
      <Button
        title="Service: One"
        onPress={() => this.navigate('Service', { service: 'One' })}
      />
      <Button
        title="Service: Two"
        onPress={() => this.navigate('Service', { service: 'Two' })}
      />
    </View>
  );
};

export default FolderScreen;
