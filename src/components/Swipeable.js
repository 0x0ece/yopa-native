import React from 'react';
import { PanResponder, View } from 'react-native';
import PropTypes from 'prop-types';


export default class Swipeable extends React.Component {
  // getDirection({ moveX, moveY, dx, dy }) {
  static getDirection({ dx }) {
    if (dx < -40) {
      return -1;
    } else if (dx > 40) {
      return 1;
    }
    return 0;
  }

  constructor(props) {
    super(props);
    this.SWIPE_RELEASE_POINT = 40;
    this.panResponder = {};
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      // this let the normal press pass down to the children
      onMoveShouldSetPanResponder: (e, gestureState) => !!Swipeable.getDirection(gestureState),
      onPanResponderEnd: (e, gestureState) => {
        const drag = Swipeable.getDirection(gestureState);
        if (drag < 0 && this.props.onSwipeLeft) {
          this.props.onSwipeLeft.call(this);
        }
        if (drag > 0 && this.props.onSwipeRight) {
          this.props.onSwipeRight.call(this);
        }
      },
      onPanResponderTerminationRequest: () => true,
    });
  }

  render() {
    // TODO(ec): animation maybe? e.g.,
    // https://github.com/expo/react-native-swipe-actions/blob/master/SwipeActions.js
    return (
      <View {...this.panResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}

Swipeable.propTypes = {
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  children: PropTypes.node.isRequired,
};
Swipeable.defaultProps = {
  onSwipeLeft: null,
  onSwipeRight: null,
};
