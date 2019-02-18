import React from 'react';
import { circles } from '../models/circles';
import Circle from './Circle';
import { View, Text, StyleSheet } from 'react-native';

type GameState = 'remember' | 'repeat' | 'home' | 'end';

interface State {
  gameState: GameState;
  sequience: string[];
  highlight: string;
  loading: number;
}

export default class Game extends React.Component<{}, State> {
  colors = Object.keys(circles);
  deselectTimer = setTimeout(() => {});
  guessIndex = 0;
  constructor(props: {}) {
    super(props);

    this.state = {
      gameState: 'remember',
      sequience: [],
      highlight: '',
      loading: 0
    };

    this.deselect = this.deselect.bind(this);
    this.onCircleLoad = this.onCircleLoad.bind(this);
    this.onCircleClick = this.onCircleClick.bind(this);
  }

  onLoaded() {
    this.init();
    this.changeMode('remember');
  }

  init() {
    this.setState({ sequience: [this.random(), this.random()] }, () => {
      this.play();
    });
  }

  play(ind: number = 0) {
    const playNext = () => {
      ind < this.state.sequience.length - 1
        ? this.play(ind + 1)
        : this.changeMode('repeat');
    };

    this.setState({ highlight: this.state.sequience[ind] }, () => {
      setTimeout(() => {
        this.deselect();
        setTimeout(() => {
          playNext();
        }, 500);
      }, 500);
    });
  }

  deselect() {
    this.setState({ highlight: '' });
  }

  changeMode(mode: GameState) {
    this.setState({ gameState: mode, highlight: '' });

    switch (mode) {
      case 'repeat':
        this.guessIndex = 0;
        break;
      case 'remember':
        clearTimeout(this.deselectTimer);
        this.play();
        break;
    }
  }

  nextWave() {
    this.add();
    this.changeMode('remember');
  }

  add() {
    this.setState(state => {
      return { sequience: [...state.sequience, this.random()] };
    });
  }

  random() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  onCircleLoad() {
    this.setState({ loading: this.state.loading + 1 }, () => {
      if (this.state.loading === this.colors.length) {
        this.onLoaded();
      }
    });
  }

  onCircleClick(color: string) {
    if (this.state.gameState === 'repeat') {
      if (color === this.state.sequience[this.guessIndex]) {
        this.selectCircle(color);
      } else {
        this.changeMode('end');
      }
    }

    if (this.state.gameState === 'end') {
      this.init();
      this.changeMode('remember');
    }
  }

  selectCircle(color: string) {
    this.deselect();
    clearTimeout(this.deselectTimer);
    this.setState({ highlight: color }, () => {
      this.deselectTimer = setTimeout( () => {
        this.deselect();
        this.guessIndex < this.state.sequience.length - 1
          ? this.guessIndex++
          : this.nextWave();
      }, 500);
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>{this.state.gameState}</Text>
        {this.colors.map(color => (
          <Circle
            color={color}
            key={color}
            full={this.state.highlight === color}
            onLoaded={this.onCircleLoad}
            onClick={this.onCircleClick}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
});
