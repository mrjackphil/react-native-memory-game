import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Game from './components/Game';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textWhite}>
          Open up App.js to start working on your app! Great. And with
          Typescript
        </Text>
        <Game />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textWhite: {
    color: 'white'
  }
});
