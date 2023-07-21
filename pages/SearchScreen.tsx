// SearchScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Button,
  FlatList,
  Switch,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import {SearchBar} from 'react-native-elements';

const SearchScreen = ({navigation}) => {
  const [continuousPlay, setContinuousPlay] = React.useState(false);

  const toggleContinuousPlay = () => {
    setContinuousPlay(previousState => !previousState);
  };

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = () => {
    // Handle the search query here
    console.log(`Searching for ${searchQuery}`);
    // For now, let's just set some dummy data
    setSearchResults(['Result 1', 'Result 2', 'Result 3']);
  };

  const handleNearbyQuery = () => {
    // Handle the nearby articles query here
    console.log('Querying for nearby articles');
  };

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <View style={styles.search}>
        <Text>Continues Playing?</Text>
        <Switch value={continuousPlay} onValueChange={toggleContinuousPlay} />
      </View>
      <Text>Search Wikipedia Articles</Text>
      <SearchBar
        placeholder="enter title or keywords"
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text>{item}</Text>}
      />
      <TouchableOpacity onPress={handleNearbyQuery} style={styles.nearby}>
        <Image source={require('../assets/icons/nearby-5-256.png')} />
      </TouchableOpacity>

      <Button
        title="Go to Playing Screen"
        onPress={() => navigation.navigate('Playing', {articleId: '123'})}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nearby: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
});
