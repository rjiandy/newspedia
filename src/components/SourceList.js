// @flow

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import type {Source} from '../types/Source-type';

type Props = {
  onPress: () => void;
  data: Source;
};

function SourceItem(props: Props) {
  let {onPress, data} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sourceText}>{data.name}</Text>
        <View style={styles.sourceInfoContainer}>
          <View style={[styles.infoContainer, {marginRight: 8}]}>
            <Text style={styles.infoText}>{data.category}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{data.language}-{data.country}</Text>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={{color: 'rgba(0, 0, 0, 0.4)'}}>{data.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default class SourceList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      newsSourceList: [],
      isLoading: true,
    };
  }
  componentWillMount() {
    this._fetchSource();
  }

  async _fetchSource() {
    this.setState({isLoading: true});
    let response = await fetch('https://newsapi.org/v2/sources?apiKey=f4ceb99764ae4b5c837a55c9d0d30c81&category=general&language=en');
    let result = await response.json();
    if (result.status === 'ok') {
      this.setState({
        newsSourceList: result.sources,
        isLoading: false,
      });
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    let {isLoading, newsSourceList} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
    if (isLoading === false && newsSourceList.length === 0) {
      return <Text>Failed Fetching Data</Text>
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.titleContainer}>
          <Text style={{fontSize: 20, color: '#42B549', fontWeight: '600'}}>newspedia</Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#F8F8F8', padding: 15}}>
          <Text style={styles.header}>News Sources</Text>
          <FlatList
            data={newsSourceList}
            renderItem={({item}) => <SourceItem data={item} onPress={() => this.props.onPress(item)} />}
            keyExtractor={(item, idx) => idx}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#F4F4F4',
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#DBDBDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '800',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#DBDBDB',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sourceInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    height: 20,
    marginBottom: 8,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  infoContainer: {
    padding: 2,
    backgroundColor: '#42B549',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceText: {
    fontWeight: '500',
    color: '#606060',
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: 'white',
  },
});
