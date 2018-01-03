// @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  WebView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  BackHandler,
  TextInput,
} from 'react-native';

import type {Article} from '../types/Article-type';

import Icon from './Icon';

function ArticleItem(props: Props) {
  return (
    <TouchableOpacity style={styles.articleContainer} onPress={props.onPress}>
      <View style={styles.flex}>
        <View style={styles.flex}>
          <Text style={styles.articleTitle}>{props.title}</Text>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <Text style={{color: 'rgba(0, 0, 0, 0.4)', fontSize: 12}}>by {props.author}</Text>
          <View style={{alignSelf: 'center', marginHorizontal: 4, height: 1, width: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}/>
          <Text style={{color: 'rgba(0, 0, 0, 0.4)', fontSize: 12}}>{new Date(Date.parse(props.publishedAt)).toUTCString().split(' ').splice(0, 4).join(' ')}</Text>
        </View>
      </View>
      <View>
        <Image
          resizeMode="cover"
          source={{uri: props.urlToImage}}
          style={{width: 100, height: 100, alignSelf: 'center'}}
        />
      </View>
    </TouchableOpacity>
  )
}

export default class ArticleList extends Component {
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      page: 1,
      isFetchMoreLoading: false,
      selectedURL: null,
      searchText: '',
      selectedQuery: '',
      articles: [],
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.selectedURL) {
        this.setState({selectedURL: null});
      } else {
        this.props.onBack();
      }
    });
    this._loadArticles();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  async _loadArticles() {
    let {source} = this.props; // TODO: ADD TO URL
    let {page, selectedQuery} = this.state;
    this.setState({
      isFetchMoreLoading: true,
    });
    let response = await fetch(`https://newsapi.org/v2/everything?sources=${source.id}&apiKey=f4ceb99764ae4b5c837a55c9d0d30c81&page=${page}&q=${encodeURIComponent(selectedQuery)}`);
    let result = await response.json();
    if (result.status === 'ok') {
      this.setState({
        isFetchMoreLoading: false,
        articles: [...this.state.articles, ...result.articles],
      });
    }
  }

  _loadMoreArticles() {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this._loadArticles();
    });
  }

  _renderFooter() {
    if (this.state.isFetchMoreLoading) {
      return (
        <View style={[styles.justifyCenter, styles.alignCenter, {width: '100%', height: 30}]}>
          <ActivityIndicator animating size="small" />
        </View>
      );
    } else {
      return null;
    }
  }
  _submitSearch() {
    this.setState({
      selectedQuery: this.state.searchText,
      page: 1,
      articles: [],
    }, () => {
      this._loadArticles();
    });
  }

  render() {
    let {articles, selectedURL} = this.state;
    return (
      <View style={styles.flex}>
        <View style={styles.titleBar}>
          <View style={styles.flex}>
            <TouchableOpacity style={[styles.flexRow, styles.alignCenter]} onPress={() => selectedURL ? this.setState({selectedURL: null}) : this.props.onBack()}>
              <Icon name="arrow-back" style={styles.backIcon} />
              <Text style={{color: 'rgba(0, 0, 0, 0.4)', fontSize: 12}}>
                {!selectedURL ? 'News Sources' : 'Articles'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.newspediaText}>newspedia</Text>
        </View>
        <View style={[styles.flex, {backgroundColor: '#F8F8F8', padding: 15}]}>
          <View style={[styles.flexRow, {marginBottom: 10}]}>
            <Text style={styles.header}>News</Text>
            <View style={styles.barSeparator} />
            <Text style={styles.header}>{this.props.source.name}</Text>
          </View>
          {selectedURL == null ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.flex}
                underlineColorAndroid="white"
                maxGrow={30}
                onChangeText={(searchText) => this.setState({searchText})}
                value={this.state.searchText}
                placeholder="Search news"
                onSubmitEditing={this._submitSearch}
              />
              <TouchableOpacity onPress={this._submitSearch} style={styles.alignCenter}>
                <Icon
                  name="search"
                  style={{fontSize: 16}}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.flex}>
            {selectedURL == null ? (
              <FlatList
                data={this.state.articles}
                ref={(ref) => {this.flatListRef = ref}}
                renderItem={({item}) => <ArticleItem {...item} onPress={() => this.setState({selectedURL: item.url})} />}
                keyExtractor={(item, index) => index}
                ListFooterComponent={this._renderFooter}
                onEndReached={this._loadMoreArticles}
                onEndTreshold={10}
              />
            ) : (
              <WebView
                source={{uri: selectedURL}}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '800',
    marginBottom: 10,
    alignSelf: 'center',
  },
  barSeparator: {
    width: 2, height: 22,
    backgroundColor: '#42B549',
    marginHorizontal: 10,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  newspediaText: {
    fontSize: 20,
    color: '#42B549',
    fontWeight: '600',
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  backIcon: {
    color: '#606060',
    fontSize: 16,
    marginRight: 4,
  },
  alignCenter: {
    alignItems: 'center',
  },
  articleTitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '600',
  },
  titleBar: {
    height: 60,
    width: '100%',
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DBDBDB',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  articleContainer: {
    height: 120,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    marginBottom: 15,
  },
  titleContainer: {
    backgroundColor: '#e6e6e6',
    height: 50,
    width: '100%',
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 4,
    paddingHorizontal: 15,
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
});
