import React from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Color } from '../Style';


const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    width: 64,
    justifyContent: 'center',
  },
  rightText: {
    flex: 1,
    justifyContent: 'center',
  },
});


class SwipeableRow extends React.Component {
  constructor(props) {
    super(props);

    this.renderRightAction = this.renderRightAction.bind(this);
    this.renderRightText = this.renderRightText.bind(this);
    this.renderRight = this.renderRight.bind(this);
  }

  close() {
    this.swipeableRow.close();
  }

  renderRightAction(text, color, x, progress) {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      this.props.onActionPress();
    };
    return (
      <Animated.View style={{ width: 64, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>
            {text}
          </Text>
        </RectButton>
      </Animated.View>
    );
  }

  renderRightText(x, progress) {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 54,
        transform: [{ translateX: trans }],
      }}
      >
        <Text>
          {this.props.swipedText}
        </Text>
      </Animated.View>
    );
  }

  renderRight(progress) {
    return (<View style={{
      width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
    >
      {this.renderRightText(500, progress)}
      {this.renderRightAction('Edit', Color.primary, 500, progress)}
    </View>);
  }

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={(ref) => { this.swipeableRow = ref; }}
        friction={2}
        rightThreshold={40}
        renderRightActions={this.renderRight}
      >
        {children}
      </Swipeable>
    );
  }
}

SwipeableRow.propTypes = {
  children: PropTypes.node.isRequired,
  onActionPress: PropTypes.func.isRequired,
  swipedText: PropTypes.string.isRequired,
};

export default SwipeableRow;
