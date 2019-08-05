import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, AsyncStorage } from 'react-native';
import { MonoText } from '../components/StyledText';

export default class PortfolioScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=silver&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson[0].spotPrice,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <View>
          <Text style={styles.helpLinkText}>
            Current Silver Spot Price: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.state.dataSource} USD/OZ
          </MonoText>
        </View>
        <View>
          <Text style={styles.helpLinkText}>
          {"\n"}Current Portfolio Value: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.state.dataSource * 1} (Based on 1 oz)
          </MonoText>
        </View>
      </View>
    );
  }
}

PortfolioScreen.navigationOptions = {
  title: 'Portfolio',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  navigationFilename: {
    marginTop: 5,
  },
});
