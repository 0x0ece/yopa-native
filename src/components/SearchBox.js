// SearchBox has been imported from https://github.com/agiletechvn/react-native-search-box
// to be able to remove the binding from onEndEditing to onCancel (commented out).
// TODO: open an issue/PR on original repo
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
  ViewPropTypes,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const containerHeight = 44;
const middleHeight = containerHeight / 2;

const styles = {
  container: {
    backgroundColor: 'grey',
    height: containerHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,
  },
  input: {
    height: containerHeight - 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 20,
    borderColor: '#444',
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    // fontSize: 13
  },
  placeholderColor: 'grey',
  iconSearch: {
    flex: 1,
    position: 'absolute',
    top: middleHeight - 9,
    height: 18,
    width: 18,
    backgroundColor: 'transparent',
  },
  iconSearchDefault: {
    color: 'grey',
  },
  iconDelete: {
    position: 'absolute',
    right: 70,
    top: middleHeight - 9,
    height: 18,
    width: 18,
    backgroundColor: 'transparent',
  },
  iconDeleteDefault: {
    color: 'grey',
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    // width: 60,
    height: 50,
  },
  cancelButtonText: {
    color: '#fff',
  },
};


class Search extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      expanded: this.props.autoFocus,
    };
    const { width } = Dimensions.get('window');
    this.contentWidth = width;
    this.middleWidth = width / 2;
    this.cancelButtonWidth = this.props.cancelButtonWidth || 65;

    /**
     * Animated values
     */
    this.iconSearchAnimated = new Animated.Value(
      this.middleWidth - this.props.searchIconCollapsedMargin,
    );
    this.iconDeleteAnimated = new Animated.Value(0);
    this.inputFocusWidthAnimated = new Animated.Value(this.contentWidth - 10);
    this.inputFocusPlaceholderAnimated = new Animated.Value(
      this.middleWidth - this.props.placeholderCollapsedMargin,
    );
    this.btnCancelAnimated = new Animated.Value(this.contentWidth);

    /**
     * functions
     */
    this.onFocus = this.onFocus.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.focus = this.focus.bind(this);
    this.expandAnimation = this.expandAnimation.bind(this);
    this.collapseAnimation = this.collapseAnimation.bind(this);
    this.onLayout = this.onLayout.bind(this);

    /**
     * local variables
     */
    this.placeholder = this.props.placeholder || 'Search';
    this.cancelTitle = this.props.cancelTitle || 'Cancel';
    this.autoFocus = this.props.autoFocus || false;

    /**
     * Shadow
     */
    this.shadowOpacityAnimated = new Animated.Value(
      this.props.shadowOpacityCollapsed,
    );
    this.shadowHeight = this.props.shadowOffsetHeightCollapsed;
  }

  componentDidMount() {
    if (this.autoFocus) {
      /* eslint no-underscore-dangle:off */
      this.inputKeywordRef._component.focus();
    }
  }

  onLayout(event) {
    const contentWidth = event.nativeEvent.layout.width;
    this.contentWidth = contentWidth;
    this.middleWidth = contentWidth / 2;
    if (this.state.expanded) {
      this.expandAnimation();
    } else {
      this.collapseAnimation();
    }
  }

  /**
 * onSearch
 * async await
 */
  async onSearch() {
    if (this.props.beforeSearch) {
      await this.props.beforeSearch(this.state.keyword);
    }
    if (this.props.keyboardShouldPersist === false) {
      await Keyboard.dismiss();
    }
    if (this.props.onSearch) {
      await this.props.onSearch(this.state.keyword);
    }
    if (this.props.afterSearch) {
      await this.props.afterSearch(this.state.keyword);
    }
  }

  /**
 * onChangeText
 * async await
 */
  async onChangeText(text) {
    await this.setState({ keyword: text });
    await new Promise((resolve) => {
      Animated.timing(this.iconDeleteAnimated, {
        toValue: text.length > 0 ? 1 : 0,
        duration: 200,
      }).start(() => resolve());
    });
    if (this.props.onChangeText) {
      await this.props.onChangeText(this.state.keyword);
    }
  }

  /**
     * onFocus
     * async await
     */
  async onFocus() {
    if (this.props.beforeFocus) {
      await this.props.beforeFocus();
    }
    /* eslint no-underscore-dangle:off */
    if (this.inputKeywordRef._component.isFocused) {
      await this.inputKeywordRef._component.focus();
    }
    await this.setState(prevState => ({ expanded: !prevState.expanded }));
    await this.expandAnimation();
    if (this.props.onFocus) {
      await this.props.onFocus(this.state.keyword);
    }
    if (this.props.afterFocus) {
      await this.props.afterFocus();
    }
  }

  /**
     * onDelete
     * async await
     */
  async onDelete() {
    if (this.props.beforeDelete) {
      await this.props.beforeDelete();
    }
    await new Promise((resolve) => {
      Animated.timing(this.iconDeleteAnimated, {
        toValue: 0,
        duration: 200,
      }).start(() => resolve());
    });
    await this.setState({ keyword: '' });
    if (this.props.onDelete) {
      await this.props.onDelete();
    }
    if (this.props.afterDelete) {
      await this.props.afterDelete();
    }
  }

  /**
     * onCancel
     * async await
     */
  async onCancel() {
    if (this.props.beforeCancel) {
      await this.props.beforeCancel();
    }
    await this.setState({ keyword: '' });
    await this.setState(prevState => ({ expanded: !prevState.expanded }));
    await this.collapseAnimation(true);
    if (this.props.onCancel) {
      await this.props.onCancel();
    }
    if (this.props.afterCancel) {
      await this.props.afterCancel();
    }
  }

  expandAnimation() {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(this.inputFocusWidthAnimated, {
          toValue: this.contentWidth - this.cancelButtonWidth,
          duration: 200,
        }).start(),
        Animated.timing(this.btnCancelAnimated, {
          toValue: 10,
          duration: 200,
        }).start(),
        Animated.timing(this.inputFocusPlaceholderAnimated, {
          toValue: this.props.placeholderExpandedMargin,
          duration: 200,
        }).start(),
        Animated.timing(this.iconSearchAnimated, {
          toValue: this.props.searchIconExpandedMargin,
          duration: 200,
        }).start(),
        Animated.timing(this.iconDeleteAnimated, {
          toValue: this.state.keyword.length > 0 ? 1 : 0,
          duration: 200,
        }).start(),
        Animated.timing(this.shadowOpacityAnimated, {
          toValue: this.props.shadowOpacityExpanded,
          duration: 200,
        }).start(),
      ]);
      this.shadowHeight = this.props.shadowOffsetHeightExpanded;
      resolve();
    });
  }

  /**
     * focus
     * async await
     */
  async focus(text = '') {
    await this.setState({ keyword: text });
    /* eslint no-underscore-dangle:off */
    await this.inputKeywordRef._component.focus();
  }

  collapseAnimation(isForceAnim = false) {
    return new Promise((resolve) => {
      Animated.parallel([
        this.props.keyboardShouldPersist === false ? Keyboard.dismiss() : null,
        Animated.timing(this.inputFocusWidthAnimated, {
          toValue: this.contentWidth - 10,
          duration: 200,
        }).start(),
        Animated.timing(this.btnCancelAnimated, {
          toValue: this.contentWidth,
          duration: 200,
        }).start(),
        this.props.keyboardShouldPersist === false
          ? Animated.timing(this.inputFocusPlaceholderAnimated, {
            toValue: this.middleWidth - this.props.placeholderCollapsedMargin,
            duration: 200,
          }).start()
          : null,
        this.props.keyboardShouldPersist === false || isForceAnim === true
          ? Animated.timing(this.iconSearchAnimated, {
            toValue: this.middleWidth - this.props.searchIconCollapsedMargin,
            duration: 200,
          }).start()
          : null,
        Animated.timing(this.iconDeleteAnimated, {
          toValue: 0,
          duration: 200,
        }).start(),
        Animated.timing(this.shadowOpacityAnimated, {
          toValue: this.props.shadowOpacityCollapsed,
          duration: 200,
        }).start(),
      ]);
      this.shadowHeight = this.props.shadowOffsetHeightCollapsed;
      resolve();
    });
  }

  render() {
    const AnimatedIcons = Animated.createAnimatedComponent(Ionicons);
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.backgroundColor && {
            backgroundColor: this.props.backgroundColor,
          },
        ]}
        onLayout={this.onLayout}
      >
        <AnimatedTextInput
          ref={(ref) => { this.inputKeywordRef = ref; }}
          style={[
            styles.input,
            this.props.placeholderTextColor && {
              color: this.props.placeholderTextColor,
            },
            this.props.inputStyle && this.props.inputStyle,
            this.props.inputHeight && { height: this.props.inputHeight },
            this.props.inputBorderRadius && {
              borderRadius: this.props.inputBorderRadius,
            },
            {
              width: this.inputFocusWidthAnimated,
              paddingLeft: this.inputFocusPlaceholderAnimated,
            },
            this.props.shadowVisible && {
              shadowOffset: {
                width: this.props.shadowOffsetWidth,
                height: this.shadowHeight,
              },
              shadowColor: this.props.shadowColor,
              shadowOpacity: this.shadowOpacityAnimated,
              shadowRadius: this.props.shadowRadius,
            },
          ]}
          // onEndEditing={this.onCancel}
          editable={this.props.editable}
          value={this.state.keyword}
          onChangeText={this.onChangeText}
          placeholder={this.placeholder}
          placeholderTextColor={
            this.props.placeholderTextColor || styles.placeholderColor
          }
          selectionColor={this.props.selectionColor}
          onSubmitEditing={this.onSearch}
          autoCorrect={false}
          blurOnSubmit={this.props.blurOnSubmit}
          returnKeyType={this.props.returnKeyType || 'search'}
          keyboardType={this.props.keyboardType || 'default'}
          autoCapitalize={this.props.autoCapitalize}
          onFocus={this.onFocus}
          underlineColorAndroid="transparent"
        />
        <TouchableWithoutFeedback onPress={this.onFocus}>
          {this.props.iconSearch
            ? <Animated.View
              style={[styles.iconSearch, { left: this.iconSearchAnimated }]}
            >
              {this.props.iconSearch}
            </Animated.View>
            : <AnimatedIcons
              name="md-search"
              size={18}
              style={[
                styles.iconSearch,
                styles.iconSearchDefault,
                this.props.tintColorSearch && {
                  color: this.props.tintColorSearch,
                },
                {
                  left: this.iconSearchAnimated,
                },
              ]}
            />}
        </TouchableWithoutFeedback>
        {this.props.useClearButton && <TouchableWithoutFeedback onPress={this.onDelete}>
          {this.props.iconDelete
            ? <Animated.View
              style={[
                styles.iconDelete,
                this.props.positionRightDelete && {
                  right: this.props.positionRightDelete,
                },
                { opacity: this.iconDeleteAnimated },
              ]}
            >
              {this.props.iconDelete}
            </Animated.View>
            : <AnimatedIcons
              name="md-close-circle"
              size={18}
              style={[
                styles.iconDelete,
                styles.iconDeleteDefault,
                this.props.tintColorDelete && {
                  color: this.props.tintColorDelete,
                },
                this.props.positionRightDelete && {
                  right: this.props.positionRightDelete,
                },
                { opacity: this.iconDeleteAnimated },
              ]}
            />}
        </TouchableWithoutFeedback>}

        <TouchableOpacity onPress={this.onCancel}>
          <Animated.View
            style={[
              styles.cancelButton,
              this.props.cancelButtonStyle && this.props.cancelButtonStyle,
              this.props.cancelButtonViewStyle && this.props.cancelButtonViewStyle,
              { left: this.btnCancelAnimated },
            ]}
          >
            <Text
              style={[
                styles.cancelButtonText,
                this.props.titleCancelColor && {
                  color: this.props.titleCancelColor,
                },
                this.props.cancelButtonStyle && this.props.cancelButtonStyle,
                this.props.cancelButtonTextStyle && this.props.cancelButtonTextStyle,
              ]}
            >
              {this.cancelTitle}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

/**
 * Props
 */
/* eslint react/require-default-props:off */
Search.propTypes = {
  /**
     * onFocus
     * return a Promise
     * beforeFocus, onFocus, afterFocus
     */
  beforeFocus: PropTypes.func,
  onFocus: PropTypes.func,
  autoFocus: PropTypes.bool,
  afterFocus: PropTypes.func,

  /**
     * onSearch
     * return a Promise
     */
  beforeSearch: PropTypes.func,
  onSearch: PropTypes.func,
  afterSearch: PropTypes.func,

  /**
     * onChangeText
     * return a Promise
     */
  onChangeText: PropTypes.func,

  /**
     * onCancel
     * return a Promise
     */
  beforeCancel: PropTypes.func,
  onCancel: PropTypes.func,
  afterCancel: PropTypes.func,

  /**
     * async await
     * return a Promise
     * beforeDelete, onDelete, afterDelete
     */
  beforeDelete: PropTypes.func,
  onDelete: PropTypes.func,
  afterDelete: PropTypes.func,

  /**
     * styles
     */
  backgroundColor: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  titleCancelColor: PropTypes.string,
  selectionColor: PropTypes.string,
  tintColorSearch: PropTypes.string,
  tintColorDelete: PropTypes.string,
  inputStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    ViewPropTypes.style,
  ]),
  cancelButtonStyle: ViewPropTypes.style,
  cancelButtonTextStyle: Text.propTypes.style,
  cancelButtonViewStyle: ViewPropTypes.style,

  /**
     * text input
     */
  placeholder: PropTypes.string,
  cancelTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  cancelButtonWidth: PropTypes.number,
  iconDelete: PropTypes.element,
  iconSearch: PropTypes.element,
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  inputHeight: PropTypes.number,
  inputBorderRadius: PropTypes.number,
  // contentWidth: PropTypes.number,
  // middleWidth: PropTypes.number,
  editable: PropTypes.bool,
  blurOnSubmit: PropTypes.bool,
  keyboardShouldPersist: PropTypes.bool,
  useClearButton: PropTypes.bool,

  /**
     * Positioning
     */
  positionRightDelete: PropTypes.number,
  searchIconCollapsedMargin: PropTypes.number,
  searchIconExpandedMargin: PropTypes.number,
  placeholderCollapsedMargin: PropTypes.number,
  placeholderExpandedMargin: PropTypes.number,

  /**
     * Shadow
     */
  shadowOffsetHeightCollapsed: PropTypes.number,
  shadowOffsetHeightExpanded: PropTypes.number,
  shadowOffsetWidth: PropTypes.number,
  shadowColor: PropTypes.string,
  shadowOpacityCollapsed: PropTypes.number,
  shadowOpacityExpanded: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowVisible: PropTypes.bool,
};

Search.defaultProps = {
  editable: true,
  blurOnSubmit: true,
  keyboardShouldPersist: false,
  searchIconCollapsedMargin: 25,
  searchIconExpandedMargin: 15,
  placeholderCollapsedMargin: 10,
  placeholderExpandedMargin: 30,
  shadowOffsetWidth: 0,
  shadowOffsetHeightCollapsed: 2,
  shadowOffsetHeightExpanded: 4,
  shadowColor: '#000',
  shadowOpacityCollapsed: 0.12,
  shadowOpacityExpanded: 0.24,
  shadowRadius: 4,
  shadowVisible: false,
  useClearButton: true,
};

export default Search;

