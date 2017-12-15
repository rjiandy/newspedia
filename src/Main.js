import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import SourceList from './components/SourceList';
import ArticleList from './components/ArticleList';

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isAssetsLoaded: true,
      source: null,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.source == null ? (
          <SourceList onPress={(source) => this.setState({source})}/>
        ) : (
          <ArticleList source={this.state.source}  onBack={() => this.setState({source: null})} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    flex: 1,
  },
});
