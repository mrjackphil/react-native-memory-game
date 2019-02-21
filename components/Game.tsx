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
    this.startGame();
  }

  startGame() {
    this.setState({ gameState: 'remember' });
    this.seq.init();
    this.show();
  }

  show() {
    this.seq.eachWithInterval(
      2000,
      this.select.bind(this),
      this.playerTurn.bind(this)
    );
  }

  nextLevel() {
    this.deselect();
    this.setState({ gameState: 'remember' });
    this.seq.add();
    this.show();
  }

  playerTurn() {
    this.deselect();
    this.setState({ gameState: 'repeat' });
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

  deselect() {
    this.setState(state => ({
      circles: [...state.circles.map(el => ({ ...el, selected: false }))]
    }));
  }

  onCircleClick(color: string) {
    if (this.state.gameState === 'repeat') {
      const result = this.seq.check(color);
      switch (result) {
        case 'end':
          this.nextLevel();
          break;
        case false:
          this.setState({ gameState: 'end' });
          break;
      }
    }

    this.state.gameState === 'end' && this.startGame();
  }

  render() {
    return (
      <View style={styles.base}>
        <Text style={styles.text}>{this.state.gameState}</Text>
        <View style={styles.circle}>
          {this.state.circles.map((circle, i) => (
            <Circle
              color={circle.color}
              key={circle.color}
              index={i}
              full={circle.selected}
              active={this.state.gameState === 'repeat'}
              onClick={this.onCircleClick.bind(this)}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center'
  },
  text: {
	color: 'white',
	marginBottom: 20
  },
  circle: {
    margin: 30,
    width: 200,
    height: 200,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    position: 'relative'
  }
});
