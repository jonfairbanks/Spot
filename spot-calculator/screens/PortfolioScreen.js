import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, AsyncStorage } from 'react-native';
import { MonoText } from '../components/StyledText';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class PortfolioScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      silver: '',
      gold: '',
      platinum: '',
      palladium: ''
    }
  }

  getSilverPrice() {
    var _this = this;
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=silver&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      _this.setState({
        isLoading: false,
        silver: responseJson[0].spotPrice,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getGoldPrice() {
    var _this = this;
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=gold&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      _this.setState({
        isLoading: false,
        gold: responseJson[0].spotPrice,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getPlatinumPrice() {
    var _this = this;
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=platinum&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      _this.setState({
        isLoading: false,
        platinum: responseJson[0].spotPrice,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getPalladiumPrice() {
    var _this = this;
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=palladium&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      _this.setState({
        isLoading: false,
        palladium: responseJson[0].spotPrice,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log('Formatting error: ' + e)
    }
  };

  componentDidMount(){
    this.getSilverPrice();
    this.getGoldPrice();
    this.getPlatinumPrice();
    this.getPalladiumPrice();
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
            ${this.formatMoney(this.state.silver)} USD/OZ
          </MonoText>
        </View>

        <View>
          <Text style={styles.helpLinkText}>
          {"\n"}Current Gold Spot Price: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.formatMoney(this.state.gold)} USD/OZ
          </MonoText>
        </View>

        <View>
          <Text style={styles.helpLinkText}>
          {"\n"}Current Platinum Spot Price: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.formatMoney(this.state.platinum)} USD/OZ
          </MonoText>
        </View>

        <View>
          <Text style={styles.helpLinkText}>
          {"\n"}Current Palladium Spot Price: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.formatMoney(this.state.palladium)} USD/OZ
          </MonoText>
        </View>

        <View>
          <Text style={styles.helpLinkText}>
          {"\n"}Current Portfolio Value: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${this.formatMoney(this.state.silver + this.state.gold)}
          </MonoText>
        </View>

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
