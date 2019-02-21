import React from 'react';
import Circle from './Circle';
import { View, Text, StyleSheet } from 'react-native';
import { CircleData } from '../entities/Circle';
import SequenceManagerEntity from '../entities/SequenceManager';
import { SequenceManager } from '../models/SequenceManager';
import AssetManager from '../models/AssetManager';

type GameState = 'remember' | 'repeat' | 'home' | 'end';

interface State {
  gameState: GameState;
  circles: CircleData[];
}

export default class Game extends React.Component<{}, State> {
  assets = new AssetManager();

  circleData = Object.keys(this.assets.empty).map(key => ({
    color: key,
    selected: false
  }));

  seq: SequenceManagerEntity = new SequenceManager(this.circleData);

  constructor(props: {}) {
    super(props);

    this.state = {
      gameState: 'remember',
      circles: this.circleData
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.seq.init();
    this.seq.eachWithInterval(2000, this.select.bind(this));
  }

  nextLevel() {
	this.seq.add();
    this.seq.eachWithInterval(2000, this.select.bind(this));
  }

  select(color: string) {
    this.setState(state => ({
      circles: [
        ...state.circles.map(el =>
          el.color === color
            ? { ...el, selected: true }
            : { ...el, selected: false }
        )
      ]
    }));
  }

  deselectAll() {
    this.setState(state => ({
      circles: [...state.circles.map(el => ({ ...el, selected: false }))]
    }));
  }

  restartGame() {
    this.nextLevel();
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>{this.state.gameState}</Text>
        {this.state.circles.map(circle => (
          <Circle
            color={circle.color}
            key={circle.color}
            full={circle.selected}
            onClick={this.restartGame.bind(this)}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  }
});
