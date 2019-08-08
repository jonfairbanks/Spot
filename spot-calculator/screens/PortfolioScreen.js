import React from 'react';
import { ActivityIndicator, Text, TextInput, View, StyleSheet, AsyncStorage } from 'react-native';
import { MonoText } from '../components/StyledText';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class PortfolioScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      silver: '',
      silverWeight: '',
      gold: '',
      goldWeight: '',
      platinum: '',
      platinumWeight: '',
      palladium: '',
      palladiumWeight: '',
      text: ''
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

  componentWillMount(){
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

        <View style={{ padding: 10 }}>
          <TextInput
            style={{ height: 40 }}
            placeholder="Set silver weight in Oz"
            onChangeText={input => this.setState({ silverWeight: input }) && AsyncStorage.setItem("silverWeight", this.state.silverWeight)}
          />
          <Text style={{ padding: 10, fontSize: 15 }}>
            Current Silver Weight (oz): {this.state.silverWeight}
          </Text>
        </View>

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#3498db' title="Create Notifications" onPress={() => {}}>
            <Icon name="md-notifications" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Add Stock" onPress={() => {}}>
            <Icon name="logo-usd" style={styles.actionButtonIcon} />
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
