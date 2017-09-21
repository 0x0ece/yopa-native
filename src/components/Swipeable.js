import React from 'react';
import { PanResponder, View } from 'react-native';

export default class Swipeable extends React.Component {
  SWIPE_RELEASE_POINT = 40;
  _panResponder = {};

  getDirection = ({ moveX, moveY, dx, dy}) => {
    if (dx < -40) {
      return -1;
    } else if (dx > 40) {
      return 1;
    }
    return 0;
  }

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      // this let the normal press pass down to the children
      onMoveShouldSetPanResponder:(e, gestureState) => !!this.getDirection(gestureState),
      onPanResponderEnd: (e, gestureState) => {
        const drag = this.getDirection(gestureState);
        if (drag < 0 && this.props.onSwipeLeft) {
          this.props.onSwipeLeft.call(this);
        }
        if (drag > 0 && this.props.onSwipeRight) {
          this.props.onSwipeRight.call(this);
        }
      },
      onPanResponderTerminationRequest: (e, gestureState) => true,
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
