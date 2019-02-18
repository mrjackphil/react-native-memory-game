import React from 'react';
import { StyleSheet, Image, TouchableHighlight } from 'react-native';
import { circles } from '../models/circles';
import { circlesFull } from '../models/circlesFull';

interface Props {
  color: string;
  full: boolean;
  onLoaded: () => void;
  onClick: (s: string) => void;
}

export default class Circle extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={() => this.props.onClick(this.props.color)}>
        <Image
          style={styles.bubble}
          source={
            this.props.full
              ? circlesFull[this.props.color]
              : circles[this.props.color]
          }
          onLoadEnd={this.props.onLoaded}
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    width: 40,
    height: 40
  }
});
