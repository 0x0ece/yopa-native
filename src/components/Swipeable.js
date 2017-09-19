import React from 'react';
import { PanResponder, View } from 'react-native';

export default class Swipeable extends React.Component {
  SWIPE_RELEASE_POINT = 40;
  _panResponder = {};

  constructor(props, context) {
    super(props, context);

    this.state = {
      dx: 0,
    };
  };

  _handlePanResponderMove = (e, gestureState) => {
    this.setState({ dx: gestureState.dx });
  };

  _handlePanResponderEnd = () => {
    if (this.state.dx > this.SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeRight) {
        this.props.onSwipeRight.call();
        this.setState({ dx: 0 });
      }
    } else if (this.state.dx < -this.SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeLeft) {
        this.props.onSwipeLeft.call();
        this.setState({ dx: 0 });
      }
    }
  };

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  };

  render = () => {
    // TODO(ec): animation maybe? e.g.,
    // https://github.com/expo/react-native-swipe-actions/blob/master/SwipeActions.js
    return (
      <View {...this._panResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}
