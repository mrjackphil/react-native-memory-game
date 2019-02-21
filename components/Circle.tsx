import React from 'react';
import { StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

interface Props {
  color: string;
  full: boolean;
  index: number;
  active?: boolean;
  onClick?: Function;
}

interface State {
  fade: Animated.Value;
  touch: boolean;
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
      fade: new Animated.Value(0),
      touch: false
    };
  }

  onHandleClick = () => {
    this.props.onClick ? this.props.onClick(this.props.color) : {};
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

    const color = `rgb(${this.rgb[this.props.color]})`;

    return (
      <TouchableWithoutFeedback
        onPress={this.onHandleClick}
        onPressIn={() => this.setState({ touch: true })}
        onPressOut={() => this.setState({ touch: false })}
      >
        <Animated.View
          transform={[
            { rotateZ: `${this.props.index * 60}deg` },
            { translateY: -100 },
            { rotateZ: `-${this.props.index * 60}deg` },
          ]}
          style={[
            styles.circle,
            { borderColor: color },
            !this.props.full &&
              this.props.active &&
              this.state.touch && { backgroundColor: color },
            this.props.full &&
              this.fadeStart && {
                backgroundColor: backgroundColor
              }
          ]}
        />
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    margin: -30,
    padding: 2,
    width: 60,
    height: 60,
    borderWidth: 4,
    borderStyle: 'solid',
    borderRadius: 50,
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
});
