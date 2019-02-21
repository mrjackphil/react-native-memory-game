import React from 'react';
import { StyleSheet, TouchableHighlight, Animated } from 'react-native';

interface Props {
  color: string;
  full: boolean;
  onClick?: Function;
}

interface State {
  fade: Animated.Value;
}

export default class Circle extends React.Component<Props, State> {
  rgb: { [k: string]: string } = {
    red: '255, 85, 85',
    orange: '255, 153, 85',
    green: '85, 255, 153',
    purple: '255, 85, 221',
    yellow: '255, 230, 128',
    blue: '128, 229, 255'
  };
  constructor(props: Props) {
    super(props);

    this.state = {
      fade: new Animated.Value(0)
    };
  }

  onHandleClick = () => {
    this.props.onClick ? this.props.onClick() : {};
  };

  get fadeStart() {
    Animated.sequence([
      Animated.timing(this.state.fade, {
        toValue: 1
      }),
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 500
      })
    ]).start();
    return true;
  }

  render() {
    const backgroundColor = this.state.fade.interpolate({
      inputRange: [0, 1],
      outputRange: [
        `rgba(${this.rgb[this.props.color]}, 0)`,
        `rgba(${this.rgb[this.props.color]}, 1)`
      ]
    });

    return (
      <TouchableHighlight onPress={this.onHandleClick}>
        <Animated.View
          style={[
            styles.circle,
            { borderColor: `rgb(${this.rgb[this.props.color]})` },
            this.props.full &&
              this.fadeStart && {
                backgroundColor: backgroundColor
              }
          ]}
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderStyle: 'solid',
    borderRadius: 50
  }
});
