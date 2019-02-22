import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// Entities
import { CircleData } from '../entities/Circle';
import SequenceManagerEntity from '../entities/SequenceManager';
// Models
import SequenceManager from '../models/SequenceManager';
import AssetManager from '../models/AssetManager';
// Components
import Circle from './Circle';

type GameState = 'remember' | 'repeat' | 'home' | 'end';

interface State {
  gameState: GameState;
  circles: CircleData[];
  guessCount: number;
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
	  circles: this.circleData,
	  guessCount: this.seq.countToGuess
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.setState({ gameState: 'home' });
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

  updateGuessCount() {
	this.setState({guessCount: this.seq.countToGuess});
  }

  onCircleClick(color: string) {
    if (this.state.gameState === 'repeat') {
	  const result = this.seq.check(color);
	  this.updateGuessCount();
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
        <Text style={styles.text}>{texts.title[this.state.gameState]}</Text>
        {['home', 'end'].filter(s => s === this.state.gameState).length > 0 && (
          <Button
            title={texts.button[this.state.gameState]}
            onPress={this.startGame.bind(this)}
          />
        )}
        {['repeat', 'remember'].filter(s => s === this.state.gameState).length >
          0 && (
          <View style={styles.circle}>
            <Text style={[styles.text, styles.big]}>
              {this.state.gameState === 'remember'
                ? this.seq.seq.length
                : this.seq.countToGuess}
            </Text>
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
        )}
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
  },
  big: {
    fontSize: 20,
    top: '50%',
    marginTop: -10
  }
});

const texts: {
  title: { [key: string]: string };
  button: { [key: string]: string };
} = {
  title: {
    home: 'Memory game',
    remember: 'Remember the sequence',
    repeat: 'Repeat the sequence',
    end: 'Game over.'
  },
  button: {
    home: 'Start game',
    end: 'Play again'
  }
};
